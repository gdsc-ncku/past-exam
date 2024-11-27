from datetime import datetime


def serialize_datetime(dt: datetime) -> str:
    if isinstance(dt, datetime):
        return dt.isoformat()  # Convert to ISO 8601 string format
    return dt  # If not a datetime, return as-is
