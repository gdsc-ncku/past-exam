from datetime import datetime
from typing import Annotated

from sqlalchemy import TIMESTAMP, Integer, String
from sqlalchemy.orm import DeclarativeBase, mapped_column


class Base(DeclarativeBase):
    pass


# Base model for all models
class BaseModel(Base):
    __abstract__ = True
    int_primary_key = Annotated[
        int, mapped_column(Integer, primary_key=True, unique=True, autoincrement=True)
    ]
    int_base = Annotated[int, mapped_column(Integer)]
    str_base = Annotated[str, mapped_column(String(255))]
    timestamp = Annotated[datetime, mapped_column(TIMESTAMP)]
