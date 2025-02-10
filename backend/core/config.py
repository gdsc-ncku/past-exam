from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Required settings with their types
    minio_access_key: str
    minio_secret_key: str
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_ip: str
    postgres_port: str
    google_redirect_uri: str
    google_client_id: str
    google_client_secret: str
    google_allowed_domains: str
    jwt_secret_key: str
    jwt_algorithm: str
    jwt_access_token_expire_minutes: str


@lru_cache
def get_settings():
    return Settings()
