from abc import ABC, abstractmethod
from typing import Dict, Protocol, Tuple

from fastapi import Response
from sqlalchemy.orm import Session


class OAuthProvider(ABC):
    @abstractmethod
    def create_auth_flow(self) -> Tuple[str, str]:
        pass

    @abstractmethod
    def process_oauth_callback(
        self,
        db: Session,
        code: str,
    ) -> Dict:
        pass

    @abstractmethod
    def verify_email_domain(self, email: str) -> bool:
        pass

class TokenService(Protocol):
    @abstractmethod
    def create_token(self, data: Dict) -> str:
        pass

    @abstractmethod
    def verify_token(self, token: str) -> Dict:
        pass

class CookieService(Protocol):
    @abstractmethod
    def set_auth_cookie(self, response: Response, user_id: str) -> None:
        pass

    @abstractmethod
    def clear_auth_cookie(self, response: Response) -> None:
        pass 