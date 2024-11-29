from fastapi.responses import JSONResponse

from schemas.common import CommentResponseModel


def error_response(e: Exception, status_code: int):
    error = CommentResponseModel(status='error', message=str(e), data=None)
    error.timestamp = error.timestamp.isoformat()
    return JSONResponse(status_code=status_code, content=error.model_dump())
