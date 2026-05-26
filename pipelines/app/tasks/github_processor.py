import logging

import litellm

from app.core.config import settings

logger = logging.getLogger(__name__)

SUMMARY_PROMPT = """\
You are a technical project analyst. Below is information gathered from a GitHub repository: \
a list of tasks/issues from the project board and key source files from the codebase.

Produce a structured summary covering:
1. **Project overview**: What this codebase does, its purpose and domain.
2. **Tech stack**: Languages, frameworks, key dependencies.
3. **Task status overview**: How many tasks are open vs closed, key themes, current priorities.
4. **Key observations**: Architecture decisions, patterns, or risks relevant to compliance analysis.

Keep the summary concise (under 1000 words). Use markdown formatting.

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

Generate a Mermaid architecture diagram using `graph TD` syntax that shows:
- Major components, modules, or services
- Data stores (databases, caches, file systems)
- External integrations or APIs
- Key relationships and data flow between components

Keep the diagram readable — no more than 15-20 nodes. Use descriptive labels.

IMPORTANT rules for valid Mermaid syntax:
- Use only square brackets for labels: A[My Label]
- Do NOT use curly braces, parentheses, or angle brackets in node definitions
- Do NOT use HTML tags inside labels
- Avoid special characters inside labels — use simple text only
- Use --> for arrows and ---|label| for edge labels

After the diagram, provide a brief description (2-3 paragraphs) explaining the architecture.

---

## File Tree (partial)

{tree}

## Key File Contents

{files}

---

Respond with ONLY the Mermaid diagram code block (```mermaid ... ```) followed by the description. \
Do not include any other text before the mermaid block.
"""


async def generate_summary(tasks_text: str, files_text: str) -> str:
    prompt = SUMMARY_PROMPT.format(tasks=tasks_text, files=files_text)

    if len(prompt) > 200_000:
        prompt = prompt[:200_000] + "\n\n[... truncated ...]"

    response = await litellm.acompletion(
        model=settings.litellm_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )
    return response.choices[0].message.content or "Summary generation failed."


async def generate_architecture(tree_text: str, files_text: str) -> str:
    prompt = ARCHITECTURE_PROMPT.format(tree=tree_text, files=files_text)

    if len(prompt) > 200_000:
        prompt = prompt[:200_000] + "\n\n[... truncated ...]"

    response = await litellm.acompletion(
        model=settings.litellm_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )
    return response.choices[0].message.content or "Architecture generation failed."
