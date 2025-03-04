from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    filename: str
    user_id: str | None


class FileCreate(FileBase):
    pass


class FileResponse(FileBase):
    file_id: str
    file_location: str
    timestamp: datetime
