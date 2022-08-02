from index import bcrypt

def hashed_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")

def check_password(pw_hashed, password):
    if bcrypt.check_password_hash(pw_hashed, password):
        return True
    else:
        return False