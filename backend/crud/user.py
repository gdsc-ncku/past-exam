from sqlalchemy.orm import Session

from models.user import User
from schemas.user import User as UserSchema


class UserCRUD:
    def create_user(self, db: Session, user: UserSchema):
        db_user = User(username=user.username, password=user.password, email=user.email)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {'data': db_user}

    def read_all_user(self, db: Session):
        users = db.query(User).all()
        return {'data': users}
