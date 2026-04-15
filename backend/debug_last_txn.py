from app import app, db
from models import Transaction, Return, ReturnItem, TransactionItem

with app.app_context():
    t = Transaction.query.order_by(Transaction.id.desc()).first()
    if t:
        print(f"Transaction ID: {t.id}")
        print(f"Original Subtotal: {t.subtotal}")
        print(f"Original Discount: {t.discount}")
        print(f"Original Tax: {t.tax}")
        print(f"Original Total: {t.total}")
        print("Items:")
        for item in t.items:
            print(f"  - {item.product.name}: Qty {item.quantity}, Price {item.unit_price}")
        
        rs = Return.query.filter_by(transaction_id=t.id).all()
        print(f"\nReturns found: {len(rs)}")
        for r in rs:
            print(f"  Return ID: {r.id}")
            print(f"  Refund Subtotal: {r.subtotal}")
            print(f"  Refund Tax: {r.tax}")
            print(f"  Refund Total: {r.total}")
            for ri in r.items:
                print(f"    Item ID: {ri.product_id}, Qty: {ri.quantity}, Price: {ri.unit_price}")
    else:
        print("No transactions found.")
