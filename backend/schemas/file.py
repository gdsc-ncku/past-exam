from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    filename: str
    uploader_id: int


class FileCreate(FileBase):
    pass


class FileResponse(FileBase):
    file_id: int
    file_location: str
    timestamp: datetime
