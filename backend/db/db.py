from sqlalchemy import URL, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import get_settings
from models.file import File
from models.user import User

DATABASE_URL = URL.create(
    'postgresql',
    username=get_settings().postgres_user,
    password=get_settings().postgres_password,
    host=get_settings().postgres_ip,
    port=get_settings().postgres_port,
    database=get_settings().postgres_db,
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    return db


def init_db():
    Base.metadata.create_all(bind=engine, tables=[User.__table__, File.__table__])
