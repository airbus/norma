# Getting Started

This guide walks you through setting up Norma and creating your first AI compliance project.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- An LLM provider account (Vertex AI, OpenAI, Anthropic, Azure, or any [LiteLLM-compatible provider](https://docs.litellm.ai/docs/providers))

## 1. Clone and configure

```bash
git clone https://github.com/airbus/norma.git
cd norma
cp .env.example .env
```

Edit `.env` and set your LLM provider. For example, with Vertex AI:

```bash
NORMA_LITELLM_MODEL=vertex_ai/gemini-2.5-flash
VERTEXAI_PROJECT=my-gcp-project
VERTEXAI_LOCATION=europe-west1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

Or with OpenAI:

```bash
NORMA_LITELLM_MODEL=openai/gpt-4o
OPENAI_API_KEY=sk-...
```

See the [LiteLLM docs](https://docs.litellm.ai/docs/providers) for all supported providers.

## 2. Start the stack

```bash
docker compose up --build
```

This starts four services:

| Service | URL | Purpose |
| --- | --- | --- |
| Frontend | [localhost:3000](http://localhost:3000) | Web interface |
| Backend | [localhost:8000](http://localhost:8000) | API server |
| Pipelines | [localhost:8001](http://localhost:8001) | Document and codebase processing |
| Database | localhost:5432 | PostgreSQL 16 + pgvector |

On first startup, the backend automatically runs database migrations and seeds the compliance frameworks (EU AI Act, UNDP Human Rights Assessment, Environmental Impact).

## 3. Create an account

1. Open [localhost:3000](http://localhost:3000) in your browser.
2. The first user is created via an admin invite. Check the backend logs for the initial invite token, or create one via the API:

```bash
curl -X POST http://localhost:8000/api/admin/invites \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "role": "admin"}'
```

3. Register with the invite token at the login page.

## 4. Create a project

Once logged in, create a new project describing your AI system:

- **Name** and **description** of the AI system
- **Intended purpose**, **intended users**, and **deployment context**

These details feed into the risk classification and give the Norma AI assistant context about your system.

## 5. Classify risk

Navigate to the **Risk Classification** page and complete the self-assessment questionnaire. Norma evaluates your answers against the EU AI Act decision tree and assigns a risk level:

| Level | Meaning |
| --- | --- |
| Unacceptable | Prohibited AI practice (Article 5) |
| High | Requires conformity assessment and full documentation (Articles 6-7) |
| Limited | Transparency obligations apply (Article 50) |
| Minimal | No specific regulatory requirements |

The risk classification updates automatically as you modify project details or questionnaire answers.

## 6. Upload documents

On the **Documents** page, upload compliance documents for each framework. Supported format: PDF.

Norma extracts the text and generates an AI summary for each document. These summaries become part of the context available to the Norma assistant and the reporting suggestion engine.

You can also upload additional documents not tied to any specific framework requirement.

## 7. Complete reporting checklists

The **Reporting** page presents compliance checklists for each framework. For each item:

- Write your evidence or comment
- Use **Ask Norma** to get AI-generated suggestions based on your project context and uploaded documents
- Validate your answers against auditor standards

## 8. Connect a GitHub repository (optional)

On the **Codebase** page, connect a GitHub repository to give Norma visibility into your codebase:

1. Add a GitHub Personal Access Token (PAT) with repo read access
2. Configure the repository owner and name
3. Sync to generate an architecture diagram and technical summary

The codebase analysis feeds into the Norma assistant's context, allowing it to reference your actual implementation when answering compliance questions.

## 9. Chat with Norma

The **Chat** page provides a context-aware AI assistant. Norma has access to:

- Your project details and risk classification
- Framework knowledge (EU AI Act articles, guidelines, compliance procedures)
- Uploaded document summaries
- Reporting evidence you have provided
- Codebase analysis (if a GitHub repo is connected)

Each chat session captures a snapshot of your project state, so the assistant's context remains consistent throughout the conversation.

## Next steps

- [Architecture](architecture.md) for a deep dive into the system design
- [API Reference](api-reference.md) for endpoint documentation
- [Deployment](deployment.md) for production configuration
- [Contributing](../CONTRIBUTING.md) to get involved
