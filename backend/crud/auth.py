from typing import Dict, Tuple

from fastapi import HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session

from core.config import get_settings
from core.interfaces import OAuthProvider
from crud.user import UserCRUD


class GoogleAuthProvider(OAuthProvider):
    def __init__(self):
        settings = get_settings()
        self.client_config = {
            "web": {
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.google_redirect_uri]
            }
        }
        self.scopes = [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
        self.user_crud = UserCRUD()

    def create_auth_flow(self) -> Tuple[str, str]:
        try:
            settings = get_settings()
            flow = Flow.from_client_config(
                self.client_config,
                scopes=self.scopes
            )
            
            flow.redirect_uri = settings.google_redirect_uri
            
            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent',
                hd='gs.ncku.edu.tw'
            )
            
            return authorization_url, state
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create authorization flow: {str(e)}"
            )

    def process_oauth_callback(
        self,
        db: Session,
        code: str,
    ) -> Dict:
        try:
            settings = get_settings()
            flow = Flow.from_client_config(
                self.client_config,
                scopes=self.scopes
            )
            flow.redirect_uri = settings.google_redirect_uri
            
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            user_info = id_token.verify_oauth2_token(
                credentials.id_token,
                requests.Request(),
                settings.google_client_id,
                clock_skew_in_seconds=60
            )
            
            if not self.verify_email_domain(user_info['email']):
                raise HTTPException(
                    status_code=401,
                    detail='Only NCKU accounts are allowed to use this service.'
                )

            google_user_info = {
                'user_id': user_info['sub'],
                'email': user_info['email'],
                'username': user_info['name'],
                'avatar': user_info.get('picture', '')
            }

            user_response = self.user_crud.get_or_create_user(
                db=db,
                google_user_info=google_user_info
            )
            
            return {
                'user': user_response.data.model_dump(),
                'access_token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_expiry': credentials.expiry.timestamp() if credentials.expiry else None
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to process OAuth callback: {str(e)}"
            )

    def verify_email_domain(self, email: str) -> bool:
        return email.endswith('@gs.ncku.edu.tw')

    def _verify_oauth_token(self, code: str) -> Dict:
        settings = get_settings()
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes
        )
        flow.redirect_uri = settings.google_redirect_uri
        flow.fetch_token(code=code)
        
        return id_token.verify_oauth2_token(
            flow.credentials.id_token,
            requests.Request(),
            settings.google_client_id
        )

    def _extract_user_info(self, id_info: Dict) -> Dict:
        return {
            'id': id_info['sub'],
            'email': id_info['email'],
            'name': id_info['name'],
            'picture': id_info.get('picture')
        }
