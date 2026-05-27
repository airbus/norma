# API Reference

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header unless noted otherwise.

## Authentication

### `POST /api/auth/register`

Register a new user with an invite token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret",
  "name": "Jane Doe",
  "invite_token": "abc123"
}
```

### `POST /api/auth/login`

Returns a JWT access token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### `GET /api/auth/me`

Returns the authenticated user's profile.

### `PATCH /api/auth/me`

Update the current user's preferences.

**Body (all fields optional):**
```json
{
  "language_preference": "es"
}
```

### `GET /api/auth/setup-status`

Check whether the system needs initial setup (no users exist). No authentication required.

**Response:**
```json
{
  "needs_setup": true
}
```

---

## Projects

### `POST /api/projects`

Create a new project. If description fields are provided, triggers an automatic risk evaluation.

**Body:**
```json
{
  "name": "My AI System",
  "description": "An AI-powered recommendation engine",
  "intended_purpose": "Product recommendations for e-commerce",
  "intended_users": "End consumers",
  "deployment_context": "EU market, B2C web application"
}
```

### `GET /api/projects`

List all projects owned by the current user.

### `GET /api/projects/{project_id}`

Get a single project by ID.

### `PATCH /api/projects/{project_id}`

Update project fields. If any risk-relevant field is changed (`description`, `intended_purpose`, `intended_users`, `deployment_context`, `questionnaire_answers`), an LLM-based risk evaluation runs automatically and the response includes the updated `risk_classification`.

**Body (all fields optional):**
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "questionnaire_answers": {
    "q1": "yes",
    "q2": "yes",
    "q3": ["none"]
  }
}
```

### `POST /api/projects/{project_id}/evaluate-risk`

Manually trigger a risk re-evaluation. No request body required.

**Response:** The full project object with updated `risk_classification`.

### `DELETE /api/projects/{project_id}`

Delete a project and all associated data (documents, chat sessions, reporting evidence).

---

## Documents

### `GET /api/projects/{project_id}/documents`

List all required documents for a project. Documents are automatically created based on framework document definitions if they don't exist yet.

**Response:**
```json
[
  {
    "id": "uuid",
    "project_id": "uuid",
    "definition_id": "uuid",
    "name": "Technical Documentation",
    "description": "Must be compiled before market entry...",
    "article": "Annex IV",
    "framework_name": "EU AI Act",
    "framework_id": "uuid",
    "uploaded": false,
    "file_name": null,
    "summary": null,
    "uploaded_at": null
  }
]
```

### `POST /api/projects/{project_id}/documents/{document_id}/upload`

Upload a file for a framework document. Accepts `multipart/form-data` with a `file` field. After upload, the file is sent to the Pipelines service for text extraction and LLM summary generation.

Supported file types: PDF, Markdown, TXT, CSV, JSON, XML, HTML.

### `DELETE /api/projects/{project_id}/documents/{document_id}/upload`

Remove an uploaded file from a framework document. Clears the file path, file name, summary, and upload timestamp. The document placeholder remains.

### Custom Documents

Free-form document uploads not tied to any framework definition. Custom document summaries are included in the chat agent and reporting suggestion context.

### `GET /api/projects/{project_id}/documents/custom`

List all custom documents for a project, ordered by upload date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "project_id": "uuid",
    "file_name": "policy.pdf",
    "summary": "LLM-generated summary or null",
    "uploaded_at": "2026-05-25T10:00:00"
  }
]
```

### `POST /api/projects/{project_id}/documents/custom/upload`

Upload a custom PDF document. Accepts `multipart/form-data` with a `file` field. Only `.pdf` files are accepted. After upload, the file is sent to the Pipelines service for processing.

### `DELETE /api/projects/{project_id}/documents/custom/{document_id}`

Delete a custom document (removes the database record and file from disk).

---

## Reporting

### `GET /api/projects/{project_id}/reporting`

List all reporting evidence entries for a project. Each entry includes the comment text and, when available, the LLM validation result (`covered`, `feedback`).

### `PUT /api/projects/{project_id}/reporting`

Bulk upsert reporting evidence. Creates or updates entries by `item_key`. Accepts optional `covered` and `feedback` fields to persist validation results alongside comments.

**Body:**
```json
{
  "items": [
    {
      "item_key": "data-governance",
      "comment": "Data governance policy documented in Confluence",
      "covered": true,
      "feedback": "Provides a concrete reference to the governance policy location."
    },
    {
      "item_key": "risk-management",
      "comment": "Risk register maintained in JIRA",
      "covered": false,
      "feedback": "Does not describe how risks are identified or mitigated."
    }
  ]
}
```

### `POST /api/projects/{project_id}/reporting/suggest`

Generate an AI-suggested comment for a reporting checklist item. Uses project context, uploaded document summaries, existing evidence, and framework knowledge to produce a concise suggestion.

**Body:**
```json
{
  "question": "[Data Governance — DG-01 Data Management] How is training data quality assured?",
  "current_comment": "Optional existing comment to improve"
}
```

**Response:**
```json
{
  "suggestion": "Training data quality is assured through automated validation pipelines and manual review."
}
```

### `POST /api/projects/{project_id}/reporting/validate`

Validate whether an answer sufficiently addresses a compliance question. Uses project context and documents to evaluate the response against a strict auditor standard.

**Body:**
```json
{
  "question": "[Data Governance — DG-01 Data Management] How is training data quality assured?",
  "answer": "We use automated validation pipelines.",
  "framework_id": "optional-framework-uuid"
}
```

**Response:**
```json
{
  "covered": false,
  "feedback": "Does not specify what validation checks are performed or how failures are handled."
}
```

---

## Frameworks

### `GET /api/frameworks`

List all active compliance frameworks.

### `GET /api/frameworks/{framework_id}`

Get a single framework by ID, including its full content.

### `GET /api/frameworks/available`

List frameworks from the built-in catalogue that are not yet active. Used to populate the "Add Framework" dialog.

**Response:**
```json
[
  {
    "name": "Environmental Impact Framework",
    "description": "Structured approach to measuring AI environmental footprint.",
    "category": "Internal"
  }
]
```

### `POST /api/frameworks`

Add a framework from the built-in catalogue. Creates the framework and its document definitions.

**Body:**
```json
{
  "name": "Environmental Impact Framework"
}
```

Returns 404 if the name is not in the catalogue, 409 if it already exists.

### `DELETE /api/frameworks/{framework_id}`

Remove a framework and its associated documents. The EU AI Act framework is protected and cannot be deleted (returns 403).

---

## Chat

### `POST /api/chat/sessions`

Create a new chat session for a project. The system prompt is assembled at creation time from the project's current state (frameworks, questionnaire answers, uploaded document summaries, reporting evidence, codebase analysis).

**Body:**
```json
{
  "project_id": "uuid"
}
```

### `GET /api/chat/sessions?project_id={uuid}`

List all chat sessions for a project.

### `GET /api/chat/sessions/{session_id}`

Get a chat session with its full message history.

### `POST /api/chat/sessions/{session_id}/messages`

Send a message and receive the complete assistant response.

**Body:**
```json
{
  "content": "What documents do I need for a high-risk AI system?"
}
```

### `POST /api/chat/sessions/{session_id}/messages/stream`

Send a message and receive the assistant response as a Server-Sent Events stream. Each event contains a text chunk:

```
data: Here is the first part...

data: of the response.

data: [DONE]
```

### `GET /api/chat/context`

Fetch the assembled context for a project, optionally filtered by section. Used by the debug context viewer.

**Query parameters:**
- `project_id` (required) — project UUID
- `section` (optional, default `full`) — one of `full`, `overview`, `frameworks`, `documents`, `reporting`, `github`

**Response:**
```json
{
  "context": "## Current Project Context\n..."
}
```

Returns `{"context": null}` if the requested section has no content.

---

## Integrations

### `GET /api/projects/{project_id}/integrations`

Get the integration configuration for a project. Returns 404 if no integration is configured.

**Response:**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "provider": "github",
  "repo_owner": "org",
  "repo_name": "repo",
  "github_project_number": 1,
  "summary": "LLM-generated summary or null",
  "architecture_mermaid": "graph TD\n...",
  "sync_status": "idle",
  "last_synced_at": "2026-05-27T10:00:00"
}
```

### `POST /api/projects/{project_id}/integrations`

Create a new integration for a project.

**Body:**
```json
{
  "provider": "github",
  "github_pat": "ghp_...",
  "repo_owner": "org",
  "repo_name": "repo",
  "github_project_number": 1
}
```

### `PATCH /api/projects/{project_id}/integrations`

Update integration configuration. All fields are optional.

### `DELETE /api/projects/{project_id}/integrations`

Remove the integration and all associated data (tasks, repo files). Returns 204.

### `POST /api/projects/{project_id}/integrations/sync`

Trigger a repository sync. Fetches the repo tree, file contents, issues, and project items from GitHub, then generates an LLM summary and architecture diagram. The sync runs asynchronously; poll the sync status endpoint to check progress.

**Response:**
```json
{
  "status": "syncing"
}
```

### `GET /api/projects/{project_id}/integrations/sync-status`

Check the current sync status.

**Response:**
```json
{
  "sync_status": "idle"
}
```

Possible values: `idle`, `syncing`, `error`.

### `GET /api/projects/{project_id}/integrations/tasks`

List GitHub tasks (issues and project items) for the integration. Supports optional query filters: `status`, `assignee`, `label`, `milestone`.

### `GET /api/projects/{project_id}/integrations/tasks/{task_id}`

Get a single GitHub task by ID.

### `GET /api/projects/{project_id}/integrations/context-file`

Get the integration's context file content (user-editable supplementary context).

### `PUT /api/projects/{project_id}/integrations/context-file`

Update the integration's context file content.

**Body:**
```json
{
  "content": "Additional context about the codebase..."
}
```

---

## Health

### `GET /api/health`

Health check endpoint. No authentication required.

**Response:**
```json
{
  "status": "ok",
  "debug": false
}
```

---

## Invites (Admin)

### `POST /api/invites`

Create an invite link (admin only).

**Body:**
```json
{
  "email": "newuser@example.com",
  "role": "member"
}
```

### `GET /api/invites`

List all invites (admin only).

### `DELETE /api/invites/{invite_id}`

Delete an unused invite (admin only). Returns 400 if the invite has already been used.

### `GET /api/invites/{token}/validate`

Validate an invite token. No authentication required. Used by the registration page.

**Response:**
```json
{
  "valid": true,
  "email": "newuser@example.com",
  "role": "member"
}
```

---

## Users (Admin)

### `GET /api/users`

List all users (admin only).

### `PATCH /api/users/{user_id}`

Update a user's role or active status (admin only). Admins cannot demote or disable themselves.

**Body (all fields optional):**
```json
{
  "role": "admin",
  "is_active": true
}
```

### `POST /api/users/{user_id}/reset-password`

Reset a user's password (admin only).

**Body:**
```json
{
  "new_password": "newSecret123"
}
```

### `DELETE /api/users/{user_id}`

Delete a user (admin only). Admins cannot delete themselves.
