from typing import Dict

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

from core.config import get_settings
from crud.auth import GoogleAuthProvider
from crud.user import UserCRUD
from db.db import get_db
from schemas.common import ResponseModel, ResponseStatus
from schemas.user import UserResponse as UserResponseSchema
from schemas.user import UserUpdate as UserUpdateSchema
from services.auth import AuthCookieService, JWTService

router = APIRouter(tags=['user'], prefix='/api/v1/user')

user_crud = UserCRUD()
auth_provider = GoogleAuthProvider()
jwt_service = JWTService()
cookie_service = AuthCookieService()
settings = get_settings()


@router.get('/profile', response_model=ResponseModel[UserResponseSchema])
async def get_user_profile(db: Session = Depends(get_db), token: str | None = Cookie(default=None)):
    if not token:
        return ResponseModel(status=ResponseStatus.ERROR, message='Not authenticated', data=None)
    return user_crud.get_user_profile(db, token)


@router.patch('/profile', response_model=ResponseModel[UserResponseSchema])
async def update_user_profile(
    update_data: UserUpdateSchema,
    db: Session = Depends(get_db),
    token: str | None = Cookie(default=None),
):
    if not token:
        return ResponseModel(status=ResponseStatus.ERROR, message='Not authenticated', data=None)
    return user_crud.update_user_profile(db, token, update_data)


@router.get('/google/login')
async def google_login():
    try:
        authorization_url, _ = auth_provider.create_auth_flow()

        return JSONResponse(content={'authorization_url': authorization_url})
    except Exception:
        raise HTTPException(status_code=400, detail='Failed to create authorization URL')


@router.get('/google/login/callback')
async def google_oauth_callback(
    code: str, db: Session = Depends(get_db), response: Response = None
) -> ResponseModel[Dict]:
    try:
        auth_result = auth_provider.process_oauth_callback(db=db, code=code)
        user_info = auth_result['user']
        token = jwt_service.create_token(
            {
                'user_id': user_info['user_id'],
                'sub': user_info['user_id'],
                'email': user_info['email'],
                'name': user_info['username'],
            }
        )

        # Create redirect response
        redirect_url = settings.frontend_url  # Replace with your frontend URL
        response = RedirectResponse(url=redirect_url)

        # Set the cookie on the redirect response
        cookie_service.set_auth_cookie(response=response, token=token)

        return response

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to process callback: {str(e)}')


@router.post('/google/logout')
async def google_logout(response: Response):
    cookie_service.clear_auth_cookie(response)
    return {'message': 'Logged out successfully'}
