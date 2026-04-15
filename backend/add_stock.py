
from app import app
from models import db, Product

def add_stock_to_all():
    with app.app_context():
        products = Product.query.all()
        if not products:
            print("No products found in the database.")
            return

        for product in products:
            # Set stock to 100 if it's currently low, or just add 100
            product.stock = (product.stock or 0) + 100
        
        db.session.commit()
        print(f"Successfully added 100 stock to each of the {len(products)} products.")

if __name__ == "__main__":
    add_stock_to_all()
