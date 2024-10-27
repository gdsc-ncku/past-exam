import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=f'.env.{os.getenv("MODE","dev")}', extra='allow')


@lru_cache
def get_settings():
    return Settings(_env_file=f'.env.{os.getenv("MODE","dev")}')
