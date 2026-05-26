from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from google.genai import types

from app.core.config import settings

SYSTEM_INSTRUCTION_TEMPLATE = """\
You are Norma, an AI compliance assistant. You help users understand and comply with \
regulatory frameworks, human rights standards, and environmental requirements for AI systems.

Your role:
- Answer questions about compliance frameworks, risk classifications, and regulatory requirements.
- Analyse the user's project context to identify compliance gaps across all applicable frameworks.
- Recommend which documents are missing or need attention.
- Explain specific articles, principles, or sections and how they apply to the user's situation.
- Provide actionable guidance based on the project's risk level and questionnaire answers.
- When GitHub repository context is available, analyse the codebase architecture, open tasks, \
and technical implementation to provide insights, suggest improvements, and answer questions \
about the project's code and development priorities.

LANGUAGE RULE: Always use British English spelling (e.g. analyse, organisation, behaviour, \
summarise, recognised, colour). Never use American English spellings.

RESPONSE STYLE: Keep responses short and visually dynamic. Use a mix of markdown elements \
to break up content — **bold** for key terms, bullet points for actionable items, \
> blockquotes for regulatory citations, and `inline code` for technical references. \
Vary your structure: a short intro sentence, then a few bullet points, then a closing thought. \
Never write long dense paragraphs. Aim for 80–150 words total. If the topic is broad, \
cover the top 2–3 priorities and offer to go deeper on any of them.

---

{context}
"""


def build_system_prompt(
    *,
    framework_contents: list[dict],
    project_context: dict | None = None,
    document_summaries: list[dict] | None = None,
    github_summary: str | None = None,
) -> str:
    parts: list[str] = []

    if framework_contents:
        parts.append("## Compliance Frameworks\n")
        for fw in framework_contents:
            parts.append(f"### {fw['name']}\n{fw['description']}\n")
            if fw.get("content"):
                parts.append(f"\n{fw['content']}\n")

    if project_context:
        parts.append("## Current Project Context\n")
        parts.append(f"**Project:** {project_context.get('name', 'Unnamed')}\n")
        if project_context.get("description"):
            parts.append(f"**Description:** {project_context['description']}\n")
        parts.append(f"**Risk Classification:** {project_context.get('risk_classification', 'Not set')}\n")
        if project_context.get("intended_purpose"):
            parts.append(f"**Intended Purpose:** {project_context['intended_purpose']}\n")
        if project_context.get("intended_users"):
            parts.append(f"**Intended Users:** {project_context['intended_users']}\n")
        if project_context.get("deployment_context"):
            parts.append(f"**Deployment Context:** {project_context['deployment_context']}\n")
        if project_context.get("questionnaire_answers"):
            parts.append("\n**Questionnaire Answers:**\n")
            for key, val in project_context["questionnaire_answers"].items():
                parts.append(f"- {key}: {val}\n")

    if document_summaries:
        parts.append("\n## Uploaded Document Summaries\n")
        for doc in document_summaries:
            parts.append(f"### {doc['name']}\n{doc['summary']}\n")

    if github_summary:
        parts.append("\n## GitHub Repository & Task Context\n")
        parts.append(github_summary)

    if project_context and project_context.get("reporting_evidence"):
        parts.append("\n## Reporting Evidence\n")
        for ev in project_context["reporting_evidence"]:
            parts.append(f"- **{ev['item_key']}:** {ev['comment']}\n")

    context = "\n".join(parts) if parts else "No project context available."
    return SYSTEM_INSTRUCTION_TEMPLATE.format(context=context)


def create_norma_agent(system_prompt: str) -> Agent:
    return Agent(
        model=LiteLlm(model=settings.litellm_model),
        name="norma",
        instruction=system_prompt,
        generate_content_config=types.GenerateContentConfig(temperature=0.2),
    )
