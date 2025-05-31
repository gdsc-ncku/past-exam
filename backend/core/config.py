from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Required settings with their types
    minio_access_key: str
    minio_secret_key: str
    minio_endpoint: str
    minio_public_endpoint: str
    minio_file_bucket: str
    minio_user_avatar_bucket: str
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
    frontend_url: str
    
    # Redis settings (optional for graceful fallback)
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    redis_db: int = 0

    class Config:
        env_file = '.env'


@lru_cache
def get_settings():
    return Settings()
