from db.db import get_db
from models.user import User
from schemas.user import User as UserSchema


class UserCRUD:
    def create_user(user: UserSchema):
        db = get_db()
        db_user = User(username=user.username, password=user.password, email=user.email)
        db.add(db_user)
        db.commit()
        db.close()
        return {'status': 'success'}

    def read_all_user():
        db = get_db()
        users = db.query(User).all()
        db.close()
        return {'status': 'success', 'users': users}
