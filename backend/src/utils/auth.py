from index import db, bcrypt

def hashed_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")

# def get_user_with_email_and_password(email, password):
#     user = User.query.filter_by(email=email).first()
#     if user and bcrypt.check_password_hash(user.password, password):
#         return user
#     else:
#         return None