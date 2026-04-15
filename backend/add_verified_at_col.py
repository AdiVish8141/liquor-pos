from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        print("Adding column age_verified_at to customers...")
        db.session.execute(text('ALTER TABLE customers ADD COLUMN age_verified_at TIMESTAMP'))
        db.session.commit()
        print("Column age_verified_at added successfully.")
    except Exception as e:
        db.session.rollback()
        if "already exists" in str(e):
            print("Column age_verified_at already exists.")
        else:
            print(f"Error adding column: {e}")
