from datetime import datetime


class Config:
    json_schema_extra = {
        'example': {
            'status': 'success',
            'message': None,
            'data': {
                'comment_id': 1,
                'commenter_id': 'dennislee03',
                'content': 'Hello World!',
                'comment_time': '2023-11-18T03:18:41.691',
            },
            'timestamp': '2023-11-18T13:42:22.308579',
        }
    }
    json_encoders = {datetime: lambda v: v.isoformat()}
