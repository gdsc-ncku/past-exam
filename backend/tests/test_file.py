import json
import random
from functools import lru_cache
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models.user import User


@lru_cache
def get_file_data():
    current_dir = Path(__file__).parent
    data_file = current_dir / "data" / "file_data.json"
    
    with open(data_file, "r") as file:
        return json.load(file)
    
def get_random_file():
    return [random.choice(get_file_data())]

@pytest.fixture
def test_user(test_db: Session):
    user = User(
        username="testuser",
        password="testpass",
        email="test@example.com"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    yield user
    
    test_db.query(User).filter(User.userId == user.userId).delete()
    test_db.commit()


@pytest.mark.parametrize("file", get_file_data())
def test_create_file(client: TestClient, test_user: User, file: dict):
    response = client.post("/file", json=file)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["filename"] == file["filename"]
    assert data["data"]["uploader_id"] == test_user.userId

@pytest.mark.parametrize("file", get_file_data())
def test_get_files(client: TestClient, test_user: User, file: dict):
    create_response = client.post("/file", json=file)
    assert create_response.status_code == 200

    get_response = client.get("/file")
    
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["status"] == "success"
    
    expected_filename_dict = {file["filename"]: file for file in get_file_data()}

    for file_data in data["data"]:
        expected_file = expected_filename_dict[file_data["filename"]]
        assert file_data["filename"] == expected_file["filename"]
        assert file_data["file_location"] == expected_file["file_location"]
        assert file_data["uploader_id"] == expected_file["uploader_id"]

@pytest.mark.parametrize("file", get_random_file())
def test_get_file(client: TestClient, test_user: User, file: dict):
    create_response = client.post("/file", json=file)
    assert create_response.status_code == 200
    file_id = create_response.json()["data"]["file_id"]

    get_response = client.get(f"/file/{file_id}")
    
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["status"] == "success"
    assert data["data"]["filename"] == file["filename"]
    assert data["data"]["file_location"] == file["file_location"]
    assert data["data"]["uploader_id"] == file["uploader_id"]


@pytest.mark.parametrize("file", get_random_file())
def test_delete_file(client: TestClient, test_user: User, file: dict):
    create_response = client.post("/file", json=file)
    assert create_response.status_code == 200
    file_id = create_response.json()["data"]["file_id"]

    delete_response = client.delete(f"/file/{file_id}")
    assert delete_response.status_code == 200
    data = delete_response.json()
    assert data["status"] == "success"

    get_response = client.get(f"/file/{file_id}")
    assert get_response.status_code == 404
