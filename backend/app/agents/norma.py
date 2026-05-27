from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from google.genai import types

from app.core.config import settings
from app.core.llm import get_language_name

QUESTION_LABELS = {
    "q1": "Does the system infer from inputs to generate outputs?",
    "q2": "Does the system operate with some level of autonomy?",
    "q3": "Does the system perform any prohibited practices?",
    "q4": "Is the system covered by EU product safety legislation?",
    "q5": "Does the product require third-party conformity assessment?",
    "q6": "Primary domain of the system's intended use",
    "q7": "Does the system evaluate individual natural persons?",
    "q8": "Does the system perform profiling of personal data?",
    "q9": "Does the system exclusively perform narrow/procedural tasks?",
    "q10": "Can persons under 18 access the system or be affected by its outputs?",
    "q11": "Does the training data include special categories of personal data?",
    "q12": "What level of human oversight does the system support?",
    "q13": "Does the system involve remote biometric identification?",
    "q14": "Is the system deployed by or on behalf of a public authority?",
    "q15": "Does the system interact directly with people?",
    "q16": "Does the system generate synthetic content?",
    "q17": "Can the system be used to create deepfakes?",
}

AREA_LABELS = {
    "cybersecurity": "Cybersecurity",
    "documentation": "Documentation",
    "qms": "Quality Management System",
    "incidents": "Incidents",
    "risk-management": "Risk Management",
    "data-governance": "Data Governance",
    "accuracy": "Accuracy",
    "records": "Records",
    "robustness": "Robustness",
    "oversight": "Oversight",
    "transparency": "Transparency",
    "surveillance": "Surveillance",
    "undp-zero-question": "UNDP Zero Question",
    "undp-org-readiness": "UNDP Organisational Readiness",
    "undp-planning": "UNDP Planning",
    "undp-rights-mapping": "UNDP Rights Mapping",
    "undp-data-diligence": "UNDP Data Diligence",
    "undp-risk-analysis": "UNDP Risk Analysis",
    "undp-risk-management": "UNDP Risk Management",
    "undp-monitoring": "UNDP Monitoring",
    "undp-framework-alignment": "UNDP Framework Alignment",
    "env-energy-carbon": "Energy & Carbon",
    "env-hardware": "Hardware",
    "env-data-management": "Data Management",
    "env-model-efficiency": "Model Efficiency",
    "env-lifecycle": "Lifecycle",
    "env-monitoring": "Environmental Monitoring",
}


def _downshift_headings(text: str) -> str:
    import re

    text = re.sub(r"^-{3,}\s*$", "", text, flags=re.MULTILINE)
    return re.sub(r"^(#{1,5}) ", lambda m: "#" + m.group(1) + " ", text, flags=re.MULTILINE)


def _format_evidence_key(item_key: str) -> str:
    import re

    from app.data.evidence_questions import EVIDENCE_QUESTIONS

    match = re.match(r"^(.+)-([A-Z]+-\d+)-(\d+)$", item_key)
    if not match:
        return item_key
    area_id, item_code, q_idx = match.groups()
    area_name = AREA_LABELS.get(area_id, area_id.replace("-", " ").title())
    question = EVIDENCE_QUESTIONS.get(item_key, "")
    label = f"{area_name} — {item_code} (Q{int(q_idx) + 1})"
    if question:
        label += f": {question}"
    return label


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

LANGUAGE RULE: {language_rule}

RESPONSE STYLE: Keep responses short and visually dynamic. Use a mix of markdown elements \
to break up content — **bold** for key terms, bullet points for actionable items, \
> blockquotes for regulatory citations, and `inline code` for technical references. \
Vary your structure: a short intro sentence, then a few bullet points, then a closing thought. \
Never write long dense paragraphs. Aim for 80–150 words total. If the topic is broad, \
cover the top 2–3 priorities and offer to go deeper on any of them.

---

{context}
"""


def _language_rule(language: str) -> str:
    lang_name = get_language_name(language)
    if language and language != "en":
        return (
            f"Always respond entirely in {lang_name}. All text, explanations, and "
            f"recommendations must be written in {lang_name}."
        )
    return (
        "Always use British English spelling (e.g. analyse, organisation, behaviour, "
        "summarise, recognised, colour). Never use American English spellings."
    )


def _group_evidence_by_framework(
    evidence: list[dict],
) -> list[tuple[str, int, list[dict]]]:
    from app.data.evidence_questions import EVIDENCE_ORDER, EVIDENCE_QUESTIONS

    totals: dict[str, int] = {"EU AI Act": 0, "UNDP Human Rights Due Diligence": 0, "Environmental Impact": 0}
    for key in EVIDENCE_QUESTIONS:
        if key.startswith("undp-"):
            totals["UNDP Human Rights Due Diligence"] += 1
        elif key.startswith("env-"):
            totals["Environmental Impact"] += 1
        else:
            totals["EU AI Act"] += 1

    groups: dict[str, list[dict]] = {}
    for ev in evidence:
        key = ev["item_key"]
        if key.startswith("undp-"):
            framework = "UNDP Human Rights Due Diligence"
        elif key.startswith("env-"):
            framework = "Environmental Impact"
        else:
            framework = "EU AI Act"
        groups.setdefault(framework, []).append(ev)

    for items in groups.values():
        items.sort(key=lambda ev: EVIDENCE_ORDER.get(ev["item_key"], 999999))

    order = ["EU AI Act", "UNDP Human Rights Due Diligence", "Environmental Impact"]
    return [(title, totals[title], groups.get(title, [])) for title in order]


def build_system_prompt(
    *,
    framework_contents: list[dict],
    project_context: dict | None = None,
    document_summaries: list[dict] | None = None,
    github_summary: str | None = None,
    github_architecture: str | None = None,
    language: str = "en",
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
                label = QUESTION_LABELS.get(key, key)
                if isinstance(val, list):
                    val = ", ".join(val)
                parts.append(f"- **{label}** — {val}\n")

    if document_summaries:
        parts.append("\n## Uploaded Document Context\n")
        for doc in document_summaries:
            parts.append(f"### {doc['name']}\n{_downshift_headings(doc['summary'])}\n")

    if github_summary or github_architecture:
        parts.append("\n## Codebase & Task Context\n")
        if github_summary:
            parts.append(_downshift_headings(github_summary))
        if github_architecture:
            import re

            summary_text = github_summary or ""
            matches = re.findall(r"^(#{1,5})\s+(\d+)\.", summary_text, re.MULTILINE)
            next_num = max((int(n) for _, n in matches), default=0) + 1
            prefix = "#" + (matches[0][0] if matches else "##")
            parts.append(f"\n{prefix} {next_num}. Architecture\n")
            parts.append(github_architecture)

    if project_context and project_context.get("reporting_evidence"):
        parts.append("\n## Reporting Evidence Context\n")
        grouped = _group_evidence_by_framework(project_context["reporting_evidence"])
        for framework_title, total, items in grouped:
            filled = [ev for ev in items if ev.get("comment", "").strip()]
            parts.append(f"\n### {framework_title} ({len(filled)} out of {total} questions answered)\n")
            for ev in filled:
                label = _format_evidence_key(ev["item_key"])
                parts.append(f"- **{label}:** {ev['comment']}\n")

    context = "\n".join(parts) if parts else "No project context available."
    return SYSTEM_INSTRUCTION_TEMPLATE.format(
        context=context,
        language_rule=_language_rule(language),
    )


def create_norma_agent(system_prompt: str) -> Agent:
    return Agent(
        model=LiteLlm(model=settings.litellm_model),
        name="norma",
        instruction=system_prompt,
        generate_content_config=types.GenerateContentConfig(temperature=0.2),
    )
