import base64
import logging
import os
import ssl
from datetime import datetime

import httpx

logger = logging.getLogger(__name__)

GITHUB_API = "https://api.github.com"


def _ssl_context() -> ssl.SSLContext | bool:
    cert_file = os.environ.get("SSL_CERT_FILE")
    if cert_file and os.path.exists(cert_file):
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.load_verify_locations(cert_file)
        ctx.verify_flags = ssl.VERIFY_DEFAULT
        return ctx
    return True


KEY_FILE_NAMES = {
    "README.md",
    "readme.md",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Dockerfile",
    "Makefile",
    "requirements.txt",
}

KEY_FILE_PATTERNS = (
    "src/index.",
    "src/main.",
    "src/app.",
    "app/main.",
    "main.",
    "src/lib.",
    "cmd/",
)


def _headers(pat: str) -> dict[str, str]:
    return {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Authorization": f"Bearer {pat}",
    }


def _parse_dt(val: str | None) -> datetime | None:
    if not val:
        return None
    return datetime.fromisoformat(val.replace("Z", "+00:00"))


async def fetch_issues(pat: str, owner: str, repo: str) -> list[dict]:
    issues: list[dict] = []
    page = 1
    async with httpx.AsyncClient(timeout=30, verify=_ssl_context()) as client:
        while True:
            resp = await client.get(
                f"{GITHUB_API}/repos/{owner}/{repo}/issues",
                headers=_headers(pat),
                params={"state": "all", "per_page": 100, "page": page},
            )
            resp.raise_for_status()
            batch = resp.json()
            if not batch:
                break
            for item in batch:
                if item.get("pull_request"):
                    continue
                issues.append(
                    {
                        "github_id": item["number"],
                        "title": item["title"],
                        "body": (item.get("body") or "")[:2000],
                        "status": item["state"],
                        "assignees": [a["login"] for a in item.get("assignees", [])],
                        "labels": [lbl["name"] for lbl in item.get("labels", [])],
                        "milestone": item["milestone"]["title"] if item.get("milestone") else None,
                        "github_url": item["html_url"],
                        "github_created_at": _parse_dt(item.get("created_at")),
                        "github_updated_at": _parse_dt(item.get("updated_at")),
                    }
                )
            if len(batch) < 100:
                break
            page += 1
    return issues


async def fetch_repo_tree(pat: str, owner: str, repo: str) -> list[str]:
    async with httpx.AsyncClient(timeout=30, verify=_ssl_context()) as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD",
            headers=_headers(pat),
            params={"recursive": "1"},
        )
        resp.raise_for_status()
        tree = resp.json().get("tree", [])
        return [item["path"] for item in tree if item["type"] == "blob"]


def select_key_files(all_paths: list[str], max_files: int = 15) -> list[str]:
    selected: list[str] = []
    for path in all_paths:
        name = path.rsplit("/", 1)[-1] if "/" in path else path
        if name in KEY_FILE_NAMES:
            selected.append(path)
        elif any(path.startswith(p) or path.endswith(p) for p in KEY_FILE_PATTERNS):
            selected.append(path)
        if len(selected) >= max_files:
            break
    return selected


async def fetch_file_content(pat: str, owner: str, repo: str, path: str) -> str:
    async with httpx.AsyncClient(timeout=30, verify=_ssl_context()) as client:
        resp = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}",
            headers=_headers(pat),
        )
        resp.raise_for_status()
        data = resp.json()
        if data.get("encoding") == "base64" and data.get("content"):
            content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
            return content[:50_000]
        return ""
