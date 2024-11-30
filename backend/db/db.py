from typing import Generator

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from core.config import get_settings
from models.comment import Comment
from models.file import File
from models.user import User

Base = declarative_base()

settings = get_settings()
DATABASE_URL = URL.create(
    'postgresql',
    username=settings.postgres_user,
    password=settings.postgres_password,
    host=settings.postgres_ip,
    port=settings.postgres_port,
    database=settings.postgres_db,
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    Base.metadata.create_all(
        bind=engine, tables=[User.__table__, File.__table__, Comment.__table__]
    )
