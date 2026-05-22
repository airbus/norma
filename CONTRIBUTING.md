# Contributing to Norma

Thank you for your interest in contributing to Norma! This guide will help you get started.

## Development Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) 22+ (for frontend development)
- [uv](https://docs.astral.sh/uv/) (for Python dependency management)

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/airbus/norma.git
   cd norma
   ```

2. Copy the environment config:

   ```bash
   cp .env.example .env
   ```

3. Start the full stack:

   ```bash
   docker compose up
   ```

   This starts the frontend (port 3000), backend (port 8000), pipelines (port 8001), and PostgreSQL with pgvector.

### Local Development (without Docker)

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Backend:**

```bash
cd backend
uv sync
uv run python main.py
```

**Pipelines:**

```bash
cd pipelines
uv sync
uv run python main.py
```

## Code Style

- **Frontend:** ESLint + Prettier. Run `npm run lint` and `npm run format:check`.
- **Backend / Pipelines:** Ruff. Run `uv run ruff check .` and `uv run ruff format --check .`.

## Pre-commit Hooks

Install pre-commit hooks to catch issues before pushing:

```bash
pip install pre-commit
pre-commit install
```

## Pull Request Process

1. Create a branch from `main`.
2. Make your changes and ensure all checks pass.
3. Open a pull request with a clear description of the changes.
4. All CI checks must pass before merging.

## Reporting Issues

Open an issue on GitHub with a clear description and steps to reproduce.
