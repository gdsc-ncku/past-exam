from datetime import datetime
from pydantic import BaseModel


class FileBase(BaseModel):
    filename: str
    file_location: str

class FileCreate(FileBase):
    uploader_id: int
class FileResponse(FileBase):
    file_id: int
    uploader_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
