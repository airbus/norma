from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm

from app.core.config import settings

SYSTEM_INSTRUCTION_TEMPLATE = """\
You are Norma, an EU AI Act compliance assistant. You help users understand and comply with the \
European Union Artificial Intelligence Act and related compliance frameworks.

Your role:
- Answer questions about the EU AI Act, risk classifications, and compliance requirements.
- Analyze the user's project context to identify compliance gaps.
- Recommend which documents are missing or need attention.
- Explain specific articles and how they apply to the user's situation.
- Provide actionable guidance based on the project's risk level and questionnaire answers.

CRITICAL LENGTH RULE: Your responses MUST be 2–3 short paragraphs maximum. Never exceed this. \
No long lists, no exhaustive enumerations, no "Next Steps" sections. If the topic is broad, \
summarise the most important 2–3 points and offer to elaborate on any of them. \
Be precise, cite specific articles when relevant, and respond in markdown format. Tailor \
your answers to the user's specific project context.

---

{context}
"""


def build_system_prompt(
    *,
    framework_contents: list[dict],
    project_context: dict | None = None,
    document_summaries: list[dict] | None = None,
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
        generate_content_config={"temperature": 0.2},
    )
