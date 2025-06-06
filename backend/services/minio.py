import io
from datetime import timedelta
from uuid import uuid4

from minio import Minio
from minio.error import S3Error

from core.config import get_settings

settings = get_settings()


class MinioService:
    def __init__(self):
        # For anonymous access (no signature validation)
        self.minio_client = Minio(
            endpoint=settings.minio_endpoint,
            access_key="",  # Empty for anonymous access
            secret_key="",  # Empty for anonymous access
            secure=False,
        )

    def upload_file(self, bucket_name: str, file_name: str | None, user_id: str, data: bytes):
        try:
            file_name = file_name if file_name else f'{user_id}/{uuid4()}'
            data_stream = io.BytesIO(data)
            data_size = len(data)
            self.minio_client.put_object(
                bucket_name=bucket_name, object_name=file_name, length=data_size, data=data_stream
            )
            # Generate and return the URL of the uploaded object
            url = f'/{bucket_name}/{file_name}'
            return url
        except S3Error as e:
            print(f'Error uploading file to MinIO: {e}')
            return False

    def get_presigned_url(self, bucket_name: str, object_name: str, expires: int = 3600):
        try:
            # For anonymous access, return direct URL instead of presigned URL
            url = f"http://{settings.minio_public_endpoint}/{bucket_name}/{object_name}"
            return url
        except S3Error as e:
            print(f'Error getting presigned URL for bucket={bucket_name}, object={object_name}: {e}')
            return None

    def delete_file(self, bucket_name: str, object_name: str):
        try:
            self.minio_client.remove_object(bucket_name=bucket_name, object_name=object_name)
        except S3Error as e:
            print(f'Error deleting file from MinIO: {e}')
            return False
