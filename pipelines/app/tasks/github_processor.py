import logging

import litellm

from app.core.config import settings
from app.core.llm import language_rule

logger = logging.getLogger(__name__)

SUMMARY_PROMPT = """\
You are a technical project analyst. Below is information gathered from a GitHub repository: \
a list of tasks/issues from the project board and key source files from the codebase.

Produce a structured summary using EXACTLY these four sections in this order:
## 1. Project Overview
What this codebase does, its purpose and domain.

## 2. Tech Stack
Languages, frameworks, key dependencies.

## 3. Tasks
List EVERY task/issue individually. For each task, include its number, title, \
status (open/closed), and a one-sentence description of what it covers. Group by status \
(open first, then closed). Do not summarise or group tasks by theme — list each one explicitly.

## 4. Key Observations
Architecture decisions, patterns, or risks relevant to compliance analysis.

Use these exact section headings (## 1. Project Overview, ## 2. Tech Stack, ## 3. Tasks, ## 4. Key Observations). \
Do not add, remove, rename, or reorder sections.
{language_rule}

---

## Tasks/Issues

{tasks}

## Key Source Files

{files}

---

Provide the structured summary:
"""

ARCHITECTURE_PROMPT = """\
You are a software architect. Below is the file tree and contents of key files from a GitHub repository.

Generate a detailed Mermaid architecture diagram using `graph TD` syntax that shows:
- Individual backend modules: API routes, services, agents, middleware, auth
- Frontend pages and key components
- Pipeline tasks and processing steps
- Data stores: databases, vector stores, file volumes
- External integrations: LLM providers, GitHub API, cloud services
- Key relationships and data flow between all components

Use subgraphs to group related components (e.g. `subgraph Backend`, `subgraph Frontend`). \
Aim for 20-30 nodes to capture meaningful detail. Use descriptive labels.

STRICT Mermaid syntax rules — violating any of these will break the diagram:
- Labels MUST be single-line: A[My Label]. NEVER put line breaks inside brackets.
- Use only square brackets for labels: A[My Label]
- Do NOT use curly braces, parentheses, or angle brackets in node definitions
- Do NOT use HTML tags or special characters inside labels
- Define each node ONCE in its subgraph. In edges, use only the node ID: A --> B (not A --> B[label])
- For edge labels use ---|label| syntax: A ---|sends data| B
- NEVER redefine a node label in an edge connection

After the diagram, provide a punchy description — 3-5 bullet points, each one sentence. \
Cover the main stack, data flow, and any notable patterns. No long paragraphs.
{language_rule}

---

## File Tree (partial)

{tree}

## Key File Contents

{files}

---

Respond with ONLY the Mermaid diagram code block (```mermaid ... ```) followed by the description. \
Do not include any other text before the mermaid block.
"""


async def generate_summary(tasks_text: str, files_text: str, language: str = "en") -> str:
    prompt = SUMMARY_PROMPT.format(tasks=tasks_text, files=files_text, language_rule=language_rule(language))

    if len(prompt) > 200_000:
        prompt = prompt[:200_000] + "\n\n[... truncated ...]"

    response = await litellm.acompletion(
        model=settings.litellm_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )
    return response.choices[0].message.content or "Summary generation failed."


async def generate_architecture(tree_text: str, files_text: str, language: str = "en") -> str:
    prompt = ARCHITECTURE_PROMPT.format(tree=tree_text, files=files_text, language_rule=language_rule(language))

    if len(prompt) > 200_000:
        prompt = prompt[:200_000] + "\n\n[... truncated ...]"

    response = await litellm.acompletion(
        model=settings.litellm_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192,
    )
    return response.choices[0].message.content or "Architecture generation failed."
