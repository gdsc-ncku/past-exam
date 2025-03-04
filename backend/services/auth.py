from datetime import datetime, timedelta, timezone
from typing import Dict

import jwt
from fastapi import Response, HTTPException

from core.config import get_settings
from core.interfaces import CookieService, TokenService


class JWTService(TokenService):
    def create_token(self, data: Dict) -> str:
        settings = get_settings()
        to_encode = data.copy()
        current_time = datetime.now(timezone.utc)
        to_encode.update(
            {
                'exp': current_time
                + timedelta(minutes=int(settings.jwt_access_token_expire_minutes)),
                'iat': current_time,
                'nbf': current_time,
            }
        )
        return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    def verify_token(self, token: str) -> Dict:
        if not token:
            raise HTTPException(status_code=401, detail='Token is required')
        settings = get_settings()
        try:
            return jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
                leeway=timedelta(seconds=30),
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail='Token has expired',
                headers={'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail=f'Invalid token',
                headers={'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'},
            )


class AuthCookieService(CookieService):
    def set_auth_cookie(self, response: Response, token: str) -> None:
        settings = get_settings()
        response.set_cookie(
            key='token',
            value=token,
            httponly=True,
            secure=True,
            samesite='lax',
            max_age=int(settings.jwt_access_token_expire_minutes) * 60,
        )

    def clear_auth_cookie(self, response: Response) -> None:
        response.delete_cookie(key='token')
