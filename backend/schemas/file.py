from pydantic import BaseModel


class File(BaseModel):
    filename: str  # The name of the file
    uploader_id: int
