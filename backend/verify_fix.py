from app import app, db
from models import Transaction, TransactionItem, Product, User

with app.app_context():
    # Find a user and product
    user = User.query.first()
    product = Product.query.first()
    
    if not user or not product:
        print("Need a user and a product to test.")
    else:
        # 1. Create a transaction with a $2 discount on a $10 item
        new_txn = Transaction(
            user_id=user.id,
            subtotal=10.0,
            tax=0.66, # (10 - 2) * 0.0825
            discount=2.0,
            total=8.66,
            payment_method='CASH'
        )
        db.session.add(new_txn)
        db.session.flush()
        
        item = TransactionItem(
            transaction_id=new_txn.id,
            product_id=product.id,
            quantity=1,
            unit_price=10.0,
            unit_discount=2.0
        )
        db.session.add(item)
        db.session.commit()
        
        print(f"Created Test Transaction ID: {new_txn.id}")
        print(f"Total Paid: {new_txn.total}")
        
        # 2. Check to_dict
        data = new_txn.to_dict()
        print(f"Serialized data unit_discount: {data['items'][0]['unit_discount']}")
        
        # 3. Clean up (optional, but good for testing)
        # db.session.delete(item)
        # db.session.delete(new_txn)
        # db.session.commit()
