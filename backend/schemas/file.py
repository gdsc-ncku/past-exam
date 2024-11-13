from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    filename: str
    file_location: str


class FileCreate(FileBase):
    uploader_id: int


class FileResponse(FileBase):
    file_id: int
    uploader_id: int
    timestamp: datetime
