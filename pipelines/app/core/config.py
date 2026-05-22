from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = {"env_prefix": "NORMA_"}

    project_name: str = "Norma Pipelines"
    debug: bool = False

    database_url: str = "postgresql+psycopg://norma:norma@db:5432/norma"

    litellm_model: str = "gemini-2.5-flash"


settings = Settings()
