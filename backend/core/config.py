from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mode: str = 'dev'
    model_config = SettingsConfigDict(env_file='.env', extra='allow')  # allow all vars in .env


setting = Settings()


@lru_cache
def get_settings():
    return setting
