# syntax=docker/dockerfile:1
FROM python:3.13-slim

WORKDIR /app

ARG UV_INDEX_URL=https://pypi.org/simple/

RUN --mount=type=secret,id=ca_cert \
    if [ -f /run/secrets/ca_cert ]; then \
        cp /run/secrets/ca_cert /usr/local/share/ca-certificates/custom-ca.crt && \
        update-ca-certificates; \
    fi

ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf --cacert /etc/ssl/certs/ca-certificates.crt https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

COPY pyproject.toml ./

RUN UV_INDEX_URL=${UV_INDEX_URL} \
    uv lock --system-certs && \
    uv sync --no-dev --no-install-project --system-certs

COPY . .

EXPOSE 8000
ENV PYTHONPATH=/app
CMD ["/bin/sh", "-c", ".venv/bin/alembic upgrade head && .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000"]
