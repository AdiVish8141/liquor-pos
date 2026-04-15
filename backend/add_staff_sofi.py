from app import app
from models import db, User

def add_sofi():
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(username='sofi').first()
        if existing_user:
            print("User 'sofi' already exists.")
            return

        new_user = User(
            username='sofi',
            full_name='Sofi Khan',
            role='CASHIER'
        )
        new_user.set_password('password123')
        
        db.session.add(new_user)
        db.session.commit()
        print("User 'Sofi Khan' (username: sofi) added successfully with password: password123")

if __name__ == '__main__':
    add_sofi()
