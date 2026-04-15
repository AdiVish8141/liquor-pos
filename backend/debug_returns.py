from app import app, db
from models import Transaction, Return, ReturnItem

with app.app_context():
    rs = Return.query.order_by(Return.id.desc()).all()
    print(f"Total returns in DB: {len(rs)}")
    for r in rs:
        t = Transaction.query.get(r.transaction_id)
        original_total = t.total if t else 0
        print(f"Return ID: {r.id}")
        print(f"  - Transaction ID: {r.transaction_id}")
        print(f"  - Original Total: {original_total}")
        print(f"  - Refund Total: {r.total}")
        print(f"  - Reason: {r.reason}")
        if r.total > original_total:
            print(f"  - ! WARNING: Refund exceeds original total !")
