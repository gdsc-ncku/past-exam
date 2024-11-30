from datetime import datetime


class CommentConfig:
    json_encoders = {datetime: lambda v: v.isoformat()}

    EXAMPLE_1 = {
        'comment_id': 1,
        'commenter_id': 'dennislee03',
        'content': 'Hello World!',
        'comment_time': '2023-11-18T03:18:41.691',
    }

    EXAMPLE_2 = {
        'comment_id': 2,
        'commenter_id': 'dennislee03',
        'content': 'Hello World!',
        'comment_time': '2023-11-19T03:18:41.691',
    }

    EXAMPLE_3 = {
        'comment_id': 3,
        'commenter_id': 'dennislee03',
        'content': 'Hello World!',
        'comment_time': '2023-11-20T03:18:41.691',
    }

    RESPONSE_MODEL_EXAMPLE = {
        'status': 'success',
        'message': 'Hello',
        'data': EXAMPLE_1,
        'timestamp': '2023-11-18T13:42:22.308579',
    }

    LIST_RESPONSE_MODEL_EXAMPLE = {
        'status': 'success',
        'message': 'Hello',
        'data': [EXAMPLE_1, EXAMPLE_2, EXAMPLE_3],
        'timestamp': '2023-11-21T13:42:22.308579',
    }
