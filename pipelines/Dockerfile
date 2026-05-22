# syntax=docker/dockerfile:1
FROM python:3.13-slim

WORKDIR /app

ARG UV_INDEX_URL=https://pypi.org/simple/

RUN --mount=type=secret,id=ca_cert \
    if [ -f /run/secrets/ca_cert ]; then \
        cp /run/secrets/ca_cert /usr/local/share/ca-certificates/custom-ca.crt && \
        update-ca-certificates; \
    fi

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

COPY pyproject.toml uv.lock* ./

RUN --mount=type=secret,id=ca_cert \
    UV_INDEX_URL=${UV_INDEX_URL} \
    UV_NATIVE_TLS=true \
    uv sync --no-dev --no-install-project

COPY . .

EXPOSE 8001
CMD [".venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
