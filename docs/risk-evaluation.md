# Dynamic Risk Evaluation

The risk evaluation system automatically classifies an AI project's risk level under the EU AI Act whenever the user updates project details or questionnaire answers.

## How It Works

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant LLM as LLM Provider

    User->>FE: Edits description or questionnaire
    FE->>FE: Debounce (1s for questionnaire)
    FE->>BE: PATCH /api/projects/{id}
    FE->>FE: Show spinner on risk banner

    BE->>BE: Update project fields in DB
    BE->>BE: Check RISK_RELEVANT_FIELDS

    alt Risk-relevant field changed
        BE->>LLM: acompletion() with decision tree + project data
        Note right of LLM: temperature=0, max_tokens=256
        LLM-->>BE: Single word response
        BE->>BE: Parse and validate classification
        BE->>BE: Update project.risk_classification
    end

    BE-->>FE: Project response
    FE->>FE: Update risk banner with new classification
```

## Risk Levels

| Level | Meaning | EU AI Act Reference |
|-------|---------|-------------------|
| **Unacceptable** | Prohibited AI practice (e.g., social scoring, subliminal manipulation, real-time biometric ID in public spaces) | Article 5 |
| **High** | System requires conformity assessment, CE marking, and full documentation | Articles 6-7 |
| **Limited** | System has transparency obligations (e.g., chatbots must disclose they are AI) | Article 50 |
| **Minimal** | No specific regulatory requirements beyond voluntary codes of practice | — |

## Self-Assessment Decision Tree

The LLM follows a 5-step decision tree embedded in the system prompt. The decision tree is evaluated holistically — the LLM considers all inputs together and returns the highest applicable risk level.

```mermaid
flowchart TD
    START([Start]) --> S2{Step 2:<br/>Prohibited practice?<br/>Art. 5}
    S2 -->|Yes| UNACCEPTABLE[Unacceptable]

    S2 -->|No| S1{Step 1:<br/>Is it an AI system?<br/>Infers + autonomy}
    S1 -->|No| MINIMAL_1[Minimal]

    S1 -->|Yes| S3{Step 3:<br/>Regulated product?<br/>Art. 6-1}
    S3 -->|Yes + 3rd party<br/>conformity assessment| HIGH_A[High]

    S3 -->|No| S4{Step 4:<br/>High-risk domain?<br/>Art. 6-2}
    S4 -->|Yes + evaluates<br/>individuals| S4_FILTER{Exclusively narrow<br/>procedural tasks?}
    S4_FILTER -->|No| HIGH_B[High]
    S4_FILTER -->|Yes| LIMITED_FILTER[Limited]

    S4 -->|No| S5{Step 5:<br/>Transparency<br/>obligations?}
    S5 -->|Yes| LIMITED[Limited]
    S5 -->|No| MINIMAL_2[Minimal]

    style UNACCEPTABLE fill:#dc2626,color:#fff
    style HIGH_A fill:#ea580c,color:#fff
    style HIGH_B fill:#ea580c,color:#fff
    style LIMITED fill:#ca8a04,color:#fff
    style LIMITED_FILTER fill:#ca8a04,color:#fff
    style MINIMAL_1 fill:#2563eb,color:#fff
    style MINIMAL_2 fill:#2563eb,color:#fff
```

**Important:** Step 2 (prohibited practices) is always checked first, regardless of whether the system qualifies as an AI system under Step 1. If any prohibited practice is selected, the result is always `unacceptable`.

## Questionnaire Mapping

The frontend self-assessment questionnaire maps to the decision tree:

| Field | Question | Decision Tree Step |
|-------|----------|-------------------|
| `q1` | Infers from inputs to generate outputs | Step 1 |
| `q2` | Operates with some level of autonomy | Step 1 |
| `q3` | Prohibited practices (multi-select) | Step 2 |
| `q4` | Covered by EU product safety legislation | Step 3 |
| `q5` | Requires third-party conformity assessment | Step 3 |
| `q6` | Primary domain of use (biometrics, critical infra, education, etc.) | Step 4 |
| `q7` | Evaluates individual natural persons | Step 4 |
| `q8` | Performs profiling | Step 4 |
| `q9` | Exclusively narrow/procedural tasks | Step 4 |
| `q15` | Interacts directly with people | Step 5 |
| `q16` | Generates synthetic content | Step 5 |
| `q17` | Can create deepfakes | Step 5 |

## Implementation Details

### Risk Evaluation Service

**File:** `backend/app/services/risk_evaluation.py`

- Uses `litellm.acompletion()` directly (not ADK) for a single-turn, structured response
- `max_tokens=256`, `temperature=0` for deterministic output
- Includes Gemini-specific `safety_settings` to prevent content filtering on sensitive topics (surveillance, biometrics) — see issue #15 for making this model-agnostic
- Response parsing: exact match against `{unacceptable, high, limited, minimal}` first, then substring search as fallback
- Returns `None` on failure — classification is left unchanged (graceful degradation)

### Trigger Logic

**File:** `backend/app/api/routes/projects.py`

- `RISK_RELEVANT_FIELDS = {"description", "intended_purpose", "intended_users", "deployment_context", "questionnaire_answers"}`
- Evaluation runs synchronously within the PATCH handler so the response includes the updated risk
- Also triggers on project creation if any context fields are provided
- Manual re-evaluation available via `POST /api/projects/{id}/evaluate-risk`

### Frontend UX

**File:** `frontend/src/pages/description.tsx`, `frontend/src/components/risk-banner.tsx`

- Spinning `Loader2` icon on the risk banner while evaluation is in-flight
- Questionnaire changes are debounced (1 second) to avoid redundant LLM calls during rapid selections
- "Re-evaluate" button with `RefreshCw` icon for manual re-trigger
