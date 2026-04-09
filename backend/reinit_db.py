from app import app
from models import db

def reinit():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Database re-initialized successfully.")

if __name__ == '__main__':
    reinit()
