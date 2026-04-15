from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        print("Adding column unit_discount to transaction_items...")
        db.session.execute(text('ALTER TABLE transaction_items ADD COLUMN unit_discount FLOAT DEFAULT 0.0'))
        db.session.commit()
        print("Column unit_discount added successfully.")
    except Exception as e:
        db.session.rollback()
        if "already exists" in str(e):
            print("Column unit_discount already exists.")
        else:
            print(f"Error adding column: {e}")
