import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from db.db import Base, get_db
from main import app
from models.file import File
from models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine, tables=[User.__table__, File.__table__])
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    app.dependency_overrides[get_db] = lambda: session
    
    yield session
    
    app.dependency_overrides.clear()
    session.close()
    
    if transaction.is_active:
        transaction.rollback()
    connection.close()

@pytest.fixture
def client(test_db):
    with TestClient(app) as test_client:
        yield test_client