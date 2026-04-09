from app import app, generate_receipt_id

with app.app_context():
    print("New ID will be:", generate_receipt_id())
