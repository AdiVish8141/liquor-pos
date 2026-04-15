from app import app, db
from models import Transaction, TransactionItem

with app.app_context():
    t = Transaction.query.get(100420260002)
    if t:
        print(f"Transaction ID: {t.id}")
        print(f"Total Paid: {t.total}")
        print(f"Subtotal: {t.subtotal}")
        print(f"Discount: {t.discount}")
        print(f"Tax: {t.tax}")
        print("\nItems:")
        for item in t.items:
            print(f"  - Product: {item.product.name}")
            print(f"    Quantity: {item.quantity}")
            print(f"    Unit Price: {item.unit_price}")
            # Check if we can find the discount applied
            print(f"    Product base discount in model: {item.product.discount}")
    else:
        print("Transaction not found.")
