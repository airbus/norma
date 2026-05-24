import logging

import litellm

from app.core.config import settings

logger = logging.getLogger(__name__)

VALID_CLASSIFICATIONS = {"unacceptable", "high", "limited", "minimal"}

SELF_ASSESSMENT = """\
# EU AI Act Self-Assessment Decision Tree

Follow this decision tree strictly to classify the AI system's risk level.

## Step 1: Is it an AI System?

- Q1: Does the system infer from inputs to generate outputs (predictions, recommendations, decisions, or content)?
  - If No → RESULT: **minimal** (outside scope of the AI Act)
  - If Not sure → proceed, flag for review

- Q2: Does the system operate with some level of autonomy?
  - If No → RESULT: **minimal** (outside scope)

## Step 2: Prohibited Practices Check

- Q3: Does the system do any of the following?
  - Uses subliminal or deceptive techniques to manipulate behaviour causing harm
  - Exploits vulnerabilities of specific groups (age, disability, socioeconomic situation)
  - Social scoring leading to unfavourable treatment in unrelated contexts
  - Predicts criminal risk based solely on profiling personality traits
  - Builds facial recognition databases by scraping images from the internet or CCTV
  - Infers emotions in workplaces or educational settings (except for medical/safety)
  - Categorises people by biometric data to deduce race, political opinions, religion, \
sexual orientation, or trade union membership
  - Uses real-time facial recognition in public spaces (except narrow law enforcement exceptions)

  If ANY of the above → RESULT: **unacceptable** (prohibited under Article 5)

## Step 3: High-Risk — Pathway A (Regulated Products)

- Q4: Is the system a product or component covered by EU product safety legislation? \
(medical devices, machinery, toys, lifts, radio equipment, PPE, aviation, vehicles, etc.)
- Q5: Does the product require a third-party conformity assessment?

  If Q4 is Yes AND Q5 is Yes → RESULT: **high** (Article 6(1))

## Step 4: High-Risk — Pathway B (Standalone Systems)

- Q6: Primary domain of use:
  - Biometrics, Critical infrastructure, Education, Employment, Essential services, Law enforcement, Migration, Justice

  If any domain matches AND:
  - Q7: The system evaluates individual natural persons → proceed
  - Q8: The system performs profiling → RESULT: **high** (Article 6(3) filter unavailable)
  - Q9: The system does NOT exclusively perform narrow/procedural tasks → RESULT: **high** (Article 6(2))
  - Q9: The system exclusively performs narrow/procedural tasks → RESULT: **limited** \
(filtered from high-risk under Article 6(3))

  If no domain matches → proceed to transparency check

## Step 5: Transparency Obligations

- Q15: Does the system interact directly with people? → transparency obligation
- Q16: Does the system generate synthetic content? → transparency obligation
- Q17: Can the system create deepfakes? → transparency obligation

If any transparency obligation applies but no higher classification → RESULT: **limited**

If none of the above apply → RESULT: **minimal**
"""

SYSTEM_PROMPT = f"""\
You are a regulatory classification engine for the EU AI Act. Your ONLY job is to determine \
the risk classification of an AI system based on the self-assessment decision tree and the \
project information provided.

{SELF_ASSESSMENT}

## Instructions

1. Analyze the project's description fields AND questionnaire answers against the decision tree above.
2. Follow the decision tree strictly and in order (Step 1 → Step 2 → Step 3 → Step 4 → Step 5).
3. Stop at the first step that produces a definitive result.
4. If questionnaire answers are incomplete or missing, infer from the free-text description fields.
5. Respond with EXACTLY ONE WORD: unacceptable, high, limited, or minimal.
6. Do not include any explanation, punctuation, or other text.
"""


def _build_user_prompt(
    *,
    description: str | None,
    intended_purpose: str | None,
    intended_users: str | None,
    deployment_context: str | None,
    questionnaire_answers: dict | None,
) -> str:
    parts: list[str] = ["# AI System Under Evaluation\n"]

    if description:
        parts.append(f"**Description:** {description}\n")
    if intended_purpose:
        parts.append(f"**Intended Purpose:** {intended_purpose}\n")
    if intended_users:
        parts.append(f"**Intended Users:** {intended_users}\n")
    if deployment_context:
        parts.append(f"**Deployment Context:** {deployment_context}\n")

    if questionnaire_answers:
        parts.append("\n## Questionnaire Answers\n")
        for key, val in questionnaire_answers.items():
            if isinstance(val, list):
                val = ", ".join(val)
            parts.append(f"- {key}: {val}\n")

    if len(parts) == 1:
        parts.append("No project information provided.\n")

    parts.append("\nClassify this system's risk level.")
    return "\n".join(parts)


async def evaluate_risk(
    *,
    description: str | None = None,
    intended_purpose: str | None = None,
    intended_users: str | None = None,
    deployment_context: str | None = None,
    questionnaire_answers: dict | None = None,
) -> str | None:
    user_prompt = _build_user_prompt(
        description=description,
        intended_purpose=intended_purpose,
        intended_users=intended_users,
        deployment_context=deployment_context,
        questionnaire_answers=questionnaire_answers,
    )

    try:
        response = await litellm.acompletion(
            model=settings.litellm_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=10,
            temperature=0,
        )
        result = response.choices[0].message.content.strip().lower()
        if result in VALID_CLASSIFICATIONS:
            return result
        logger.warning("LLM returned unexpected classification: %s", result)
        return None
    except Exception:
        logger.exception("Risk evaluation failed")
        return None
