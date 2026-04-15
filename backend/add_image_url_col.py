
from app import app, db
from sqlalchemy import text

def migrate():
    with app.app_context():
        # Check if column exists (SQLite specific check)
        try:
            db.session.execute(text("ALTER TABLE products ADD COLUMN image_url VARCHAR(500)"))
            db.session.commit()
            print("Successfully added image_url column to products table.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("Column image_url already exists.")
            else:
                print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
