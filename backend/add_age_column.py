from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        print("Adding column age to customers...")
        db.session.execute(text('ALTER TABLE customers ADD COLUMN age INTEGER'))
        db.session.commit()
        print("Column age added successfully.")
    except Exception as e:
        db.session.rollback()
        if "already exists" in str(e):
            print("Column age already exists.")
        else:
            print(f"Error adding column: {e}")
