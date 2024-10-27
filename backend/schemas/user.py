from pydantic import BaseModel


class User(BaseModel):
    username: str  # The name of the file
    password: str
    email: str
