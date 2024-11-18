from sqlalchemy import URL, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import get_settings
from models.comment import Comment
from models.file import File
from models.user import User


def get_db():
    db = SessionLocal()
    return db


def init_db():
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
    global SessionLocal
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    Base.metadata.create_all(
        bind=engine, tables=[User.__table__, File.__table__, Comment.__table__]
    )
