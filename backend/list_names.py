
from app import app
from models import Product

with app.app_context():
    for p in Product.query.all():
        print(f"NAME: {p.name} | FULL: {p.full_name}")
