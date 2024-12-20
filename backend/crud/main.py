from core.config import get_settings


def get_env_info():
    settings = get_settings()
    return {
        'minio_access_key': settings.minio_access_key,
        'minio_secret_key': settings.minio_secret_key,
        'postgres_user': settings.postgres_user,
        'postgres_password': settings.postgres_password,
        'postgres_db': settings.postgres_db,
        'postgres_ip': settings.postgres_ip,
    }


def health():
    return {'status': 'ready'}
