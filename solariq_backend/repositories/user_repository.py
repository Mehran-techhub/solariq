from extensions import db
from models.user import User


class UserRepository:
    @staticmethod
    def find_by_email(email):
        return User.query.filter_by(email=email.lower().strip()).first()

    @staticmethod
    def find_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def create(user):
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update(user):
        db.session.commit()
        return user
