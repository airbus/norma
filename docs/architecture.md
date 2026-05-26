# Architecture

Norma is a cloud-agnostic, LLM-agnostic compliance management platform that helps organisations assess, track, and demonstrate conformity with the EU AI Act and other regulatory frameworks. It combines structured project management workflows with LLM-powered features — dynamic risk classification, document summarisation, and a context-aware compliance assistant.

The platform is built as a three-service architecture orchestrated by Docker Compose, sharing a PostgreSQL database and a file storage volume.

## System Overview

```mermaid
graph TB
    User([User / Browser])

    subgraph Docker Compose
        FE[Frontend<br/>React + Vite + Tailwind<br/>:3000]

        subgraph Backend Services
            BE[Backend<br/>FastAPI + ADK<br/>:8000]
            PL[Pipelines<br/>FastAPI<br/>:8001]
        end

        DB[(PostgreSQL 16<br/>+ pgvector<br/>:5432)]
        VOL[/Shared Volume<br/>norma-data/]
    end

    LLM{{LLM Provider<br/>via LiteLLM}}

    User -->|HTTPS| FE
    FE -->|/api proxy| BE
    BE -->|HTTP internal| PL
    BE -->|SQL| DB
    PL -->|SQL| DB
    BE -->|acompletion / ADK| LLM
    PL -->|acompletion| LLM
    BE ---|read/write| VOL
    PL ---|read/write| VOL
```

## Services

### Frontend

**Stack:** React 18, Vite, Tailwind CSS, shadcn/ui, Lucide icons, React Router

The single-page application provides the full user workflow:

- **Project management** — create and configure AI system compliance projects
- **Self-assessment questionnaire** — 17-question EU AI Act decision tree (6 sections covering AI system identification, prohibited practices, regulated products, standalone systems, GPAI, and transparency)
- **Risk banner** — real-time display of the LLM-evaluated risk classification with re-evaluate controls
- **Document checklist** — per-framework required documents with file upload and LLM-generated summaries, plus free-form custom PDF uploads
- **Reporting checklist** — compliance evidence tracking with free-text comments per item and AI-powered suggestion generation
- **Chat interface** — streaming conversation with the Norma AI assistant, with full project context
- **Settings** — user and admin management (invite links, user listing)

In production, the frontend is served via Nginx which proxies `/api` requests to the backend service.

### Backend

**Stack:** FastAPI, SQLAlchemy 2.0, Alembic, Google ADK (>=2.0), LiteLLM, Pydantic v2

The central API server handling all business logic:

| Module | Responsibility |
|--------|---------------|
| **Authentication** (`app/api/routes/auth.py`) | JWT-based auth with bcrypt password hashing. Users register via single-use invite tokens created by admins. Tokens expire after 7 days. |
| **Projects** (`app/api/routes/projects.py`) | Full CRUD for compliance projects. PATCH requests that modify risk-relevant fields (description, intended purpose, intended users, deployment context, questionnaire answers) automatically trigger an LLM-based risk evaluation. |
| **Risk Evaluation** (`app/services/risk_evaluation.py`) | One-shot LLM call using `litellm.acompletion()` that classifies a project as `unacceptable`, `high`, `limited`, or `minimal` based on the EU AI Act self-assessment decision tree. |
| **Chat / Norma Agent** (`app/agents/norma.py`, `app/api/routes/chat.py`) | Multi-turn AI assistant built on Google ADK. System prompt assembled from framework knowledge, project context, uploaded document summaries, and reporting evidence. Supports both synchronous and SSE streaming responses. |
| **Documents** (`app/api/routes/documents.py`) | Manages per-project document instances derived from framework-defined templates, plus free-form custom PDF uploads. Handles file uploads and delegates processing to the Pipelines service. |
| **Reporting** (`app/api/routes/reporting.py`) | Bulk upsert of compliance checklist evidence entries keyed by item identifier. Each entry stores the user's comment alongside an LLM-generated validation result (`covered` flag and `feedback` text). Includes a suggestion endpoint that generates context-aware comments and a validation endpoint that evaluates whether an answer satisfies the compliance question. |
| **Frameworks** (`app/api/routes/frameworks.py`) | Read-only endpoints for regulatory frameworks and their metadata. |
| **Seeding** (`app/services/seed.py`) | On startup, seeds the EU AI Act framework with its required document definitions and loads knowledge base content from markdown files. Also creates a sample project for newly registered users. |
| **Migrations** (`alembic/`) | Alembic manages schema migrations, run automatically on backend startup. |

### Pipelines

**Stack:** FastAPI, LiteLLM, PyMuPDF

A lightweight, independently scalable service dedicated to heavy processing tasks. Currently handles document processing:

1. **Text extraction** — reads uploaded files (PDF via PyMuPDF, or plain text for Markdown/TXT/CSV/JSON/XML/HTML)
2. **LLM summarisation** — sends extracted text to `litellm.acompletion()` with a structured prompt requesting comprehensive markdown summaries
3. **Database update** — writes the generated summary back to the `documents.summary` or `custom_documents.summary` column (determined by the `table_name` parameter)

The Pipelines service shares the `norma-data` volume with the Backend for file access and connects directly to PostgreSQL for writing summaries.

### Database

**Stack:** PostgreSQL 16 with pgvector extension

```mermaid
erDiagram
    users ||--o{ projects : owns
    users ||--o{ chat_sessions : participates
    projects ||--o{ documents : has
    projects ||--o{ custom_documents : has
    projects ||--o{ reporting_evidence : has
    projects ||--o{ chat_sessions : has
    frameworks ||--o{ document_definitions : defines
    document_definitions ||--o{ documents : instantiates
    chat_sessions ||--o{ chat_messages : contains

    users {
        uuid id PK
        string email UK
        string name
        string hashed_password
        string role
        boolean is_active
        datetime created_at
    }

    projects {
        uuid id PK
        uuid owner_id FK
        string name
        text description
        string risk_classification
        text intended_purpose
        text intended_users
        text deployment_context
        jsonb questionnaire_answers
        datetime created_at
        datetime updated_at
    }

    frameworks {
        uuid id PK
        string name UK
        text description
        string category
        string status
        text content
        datetime created_at
    }

    document_definitions {
        uuid id PK
        uuid framework_id FK
        string name
        text description
        string article
    }

    documents {
        uuid id PK
        uuid project_id FK
        uuid definition_id FK
        string file_path
        string file_name
        text summary
        datetime uploaded_at
        datetime created_at
    }

    custom_documents {
        uuid id PK
        uuid project_id FK
        string file_name
        string file_path
        text summary "LLM-generated, nullable"
        datetime uploaded_at
        datetime created_at
    }

    reporting_evidence {
        uuid id PK
        uuid project_id FK
        string item_key
        text comment
        boolean covered "nullable — LLM validation result"
        text feedback "nullable — LLM validation feedback"
        datetime updated_at
    }

    chat_sessions {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        text system_prompt
        datetime created_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK
        string role
        text content
        datetime created_at
    }
```

Key design decisions:

- **`frameworks.content`** stores the full knowledge base (concatenated markdown files) rather than referencing external files at runtime. This ensures the chat agent's context is self-contained and the knowledge base is versioned with the database.
- **`chat_sessions.system_prompt`** is frozen at session creation time. This guarantees conversation consistency — the agent's context doesn't shift mid-conversation if the user updates their project.
- **`questionnaire_answers`** uses JSONB to accommodate the variable structure of the self-assessment questionnaire (mix of single-select and multi-select answers).
- **`reporting_evidence`** uses a composite unique constraint on `(project_id, item_key)` for idempotent upserts.

## LLM Integration

Norma uses **LiteLLM** as the model abstraction layer, configured via the `NORMA_LITELLM_MODEL` environment variable. This supports any LiteLLM-compatible provider (Vertex AI, OpenAI, Anthropic, Azure, etc.) without code changes.

```mermaid
graph LR
    subgraph Backend
        RE[Risk Evaluation<br/>litellm.acompletion]
        NA[Norma Agent<br/>ADK Agent + Runner]
    end

    subgraph Pipelines
        DP[Document Processor<br/>litellm.acompletion]
    end

    LLM_ADAPTER[LiteLLM<br/>Model Router]

    RE -->|one-shot| LLM_ADAPTER
    NA -->|multi-turn via ADK LiteLlm adapter| LLM_ADAPTER
    DP -->|one-shot| LLM_ADAPTER

    LLM_ADAPTER -->|vertex_ai/| VERTEX[Vertex AI]
    LLM_ADAPTER -->|openai/| OPENAI[OpenAI]
    LLM_ADAPTER -->|anthropic/| ANTHROPIC[Anthropic]
    LLM_ADAPTER -->|...| OTHER[Other Providers]
```

Two distinct LLM usage patterns:

| Pattern | Used By | How | Purpose |
|---------|---------|-----|---------|
| **One-shot classification** | Risk evaluation, Document processing | `litellm.acompletion()` directly | Single-turn, structured output. Risk eval returns exactly one word. Document processing returns a markdown summary. |
| **Multi-turn agent** | Norma chat | Google ADK `Agent` + `Runner` + `InMemorySessionService`, with `LiteLlm` model adapter | Conversational AI assistant with full project context in the system prompt. Supports streaming via SSE. |

## Data Flows

### Risk Evaluation

Triggered automatically when a user updates any risk-relevant project field, or manually via the "Re-evaluate" button.

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant LLM as LLM Provider

    User->>FE: Edits description / questionnaire
    FE->>BE: PATCH /api/projects/{id}
    BE->>BE: Update project in DB
    BE->>BE: Check if risk-relevant fields changed

    alt Risk-relevant field changed
        BE->>LLM: acompletion() with self-assessment<br/>decision tree + project data
        LLM-->>BE: "high" (single word)
        BE->>BE: Update project.risk_classification
    end

    BE-->>FE: Project response with updated risk
    FE->>FE: Update risk banner
```

### Document Upload and Summarisation

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant PL as Pipelines
    participant LLM as LLM Provider
    participant DB as PostgreSQL

    User->>FE: Uploads file
    FE->>BE: POST /api/projects/{id}/documents/{id}/upload
    BE->>BE: Save file to /data/uploads/
    BE->>DB: Update file_path, file_name, uploaded_at

    BE->>PL: POST /api/documents/process<br/>{document_id, file_path}

    PL->>PL: Extract text (PyMuPDF for PDF, UTF-8 for text)
    PL->>LLM: acompletion() with extracted text
    LLM-->>PL: Markdown summary
    PL->>DB: UPDATE documents SET summary = ...

    BE-->>FE: Document response
    FE->>FE: Display upload confirmation + summary
```

### Chat with Norma

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant ADK as ADK Runner
    participant LLM as LLM Provider

    User->>FE: Creates chat session
    FE->>BE: POST /api/chat/sessions
    BE->>BE: Assemble system prompt from:<br/>- Framework knowledge base<br/>- Project fields + questionnaire<br/>- Uploaded document summaries<br/>- Reporting evidence
    BE->>BE: Store frozen system prompt
    BE-->>FE: Session created

    User->>FE: Sends message
    FE->>BE: POST /api/chat/sessions/{id}/messages/stream
    BE->>ADK: Create Agent with frozen system prompt
    BE->>ADK: Load message history into session
    BE->>ADK: runner.run_async(new_message)
    ADK->>LLM: Messages + system prompt
    loop Streaming
        LLM-->>ADK: Token chunk
        ADK-->>BE: Event with content
        BE-->>FE: SSE data: chunk
    end
    BE->>BE: Save assistant message to DB
    BE-->>FE: SSE data: [DONE]
```

## Knowledge Base

Regulatory knowledge is stored as markdown files organised by framework and loaded into the database at startup:

```
backend/app/data/knowledge/
  eu_ai_act/
    00_getting_started.md      -- Introduction and overview (sorted first)
    eu_ai_act_summary.md       -- Full regulation summary
    high_risk_guidelines.md    -- High-risk system compliance guide
    sandbox_guidelines.md      -- AI regulatory sandbox guide
```

The seed service scans each framework's subdirectory by name slug (e.g., `eu_ai_act` for "EU AI Act"), concatenates all `.md` files in sorted order, and stores the result in `frameworks.content`. On subsequent startups, if file content has changed, the database is updated automatically.

This content is included in the Norma chat agent's system prompt, giving it deep regulatory knowledge to draw from when answering user questions.
