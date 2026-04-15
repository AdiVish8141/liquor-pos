import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from dotenv import load_dotenv
from models import db, User, Product, Customer, Transaction, TransactionItem, Return, ReturnItem

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for React frontend

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Create database tables (simple approach for startup)
with app.app_context():
    db.create_all()

@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'POST':
        data = request.get_json()
        new_product = Product(
            name=data.get('name'),
            full_name=data.get('full_name'),
            sku=data.get('sku'),
            price=float(data.get('price', 0)),
            stock=int(data.get('stock', 0)),
            bg=data.get('bg', '#f1f5f9'),
            category=data.get('category'),
            volume=data.get('volume', ''),
            case_bottle=data.get('case_bottle', ''),
            abv=data.get('abv', ''),
            discount=float(data.get('discount', 0.0)),
            tax_category=data.get('tax_category', 'Liquor'),
            deposit=float(data.get('deposit', 0.0)),
            age_verified=bool(data.get('age_verified', True))
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201
        
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@app.route('/api/products/update-stock', methods=['POST'])
@jwt_required()
def update_stock():
    data = request.get_json()
    product_id = data.get('id')
    delta = data.get('delta', 0)
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404
    
    product.stock += delta
    db.session.commit()
    return jsonify(product.to_dict()), 200

def generate_receipt_id():
    today = datetime.now()
    date_prefix = today.strftime("%d%m%Y")
    start_of_day = today.replace(hour=0, minute=0, second=0, microsecond=0)
    count = Transaction.query.filter(Transaction.created_at >= start_of_day).count()
    new_id_str = f"{date_prefix}{(count + 1):04d}"
    return int(new_id_str)

@app.route('/api/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.get_json()
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    try:
        new_txn = Transaction(
            id=generate_receipt_id(),
            user_id=user.id,
            customer_id=data.get('customer_id'),
            subtotal=data.get('subtotal'),
            tax=data.get('tax'),
            discount=data.get('discount', 0),
            total=data.get('total'),
            payment_method=data.get('payment_method')
        )
        db.session.add(new_txn)
        db.session.flush() # Get the transaction ID
        
        for item in data.get('items', []):
            txn_item = TransactionItem(
                transaction_id=new_txn.id,
                product_id=item['id'],
                quantity=item['quantity'],
                unit_price=item['price'],
                unit_discount=item.get('discount', 0.0)
            )
            db.session.add(txn_item)
            
            # Update product stock in DB
            product = Product.query.get(item['id'])
            if not product:
                db.session.rollback()
                return jsonify({"msg": f"Product ID {item['id']} not found"}), 404
            
            # Check stock one last time
            if product.stock < item['quantity']:
                db.session.rollback()
                return jsonify({"msg": f"Insufficient stock for {product.name}"}), 400
                
            product.stock -= item['quantity']
            
        db.session.commit()
        return jsonify(new_txn.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Transaction error: {e}")
        return jsonify({"msg": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.username)
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        }), 200
    
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/customers', methods=['GET', 'POST'])
def get_customers():
    if request.method == 'POST':
        data = request.get_json()
        new_customer = Customer(
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email'),
            age=data.get('age')
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify(new_customer.to_dict()), 201
    
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers]), 200

@app.route('/api/customers/<int:customer_id>/verify', methods=['POST'])
@jwt_required()
def verify_customer_age(customer_id):
    data = request.get_json()
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"msg": "Customer not found"}), 404
        
    try:
        new_age = int(data.get('age', 0))
        if new_age <= 0:
            return jsonify({"msg": "Invalid age"}), 400
            
        customer.age = new_age
        customer.age_verified_at = datetime.utcnow()
        db.session.commit()
        return jsonify(customer.to_dict()), 200
    except ValueError:
        return jsonify({"msg": "Invalid age format"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    return jsonify(user.to_dict()), 200

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.created_at.desc()).limit(50).all()
    results = []
    for t in transactions:
        data = t.to_dict()
        data['customer_name'] = t.customer.name if t.customer else "Walk-in"
        results.append(data)
    return jsonify(results), 200


@app.route('/api/transactions/<int:txn_id>', methods=['GET'])
@jwt_required()
def get_transaction(txn_id):
    """Return a single transaction with its items and product details, including already returned qty."""
    txn = Transaction.query.get(txn_id)
    if not txn:
        return jsonify({"msg": "Transaction not found"}), 404
    data = txn.to_dict()
    data['customer_name'] = txn.customer.name if txn.customer else "Walk-in"
    
    # Calculate already returned quantities for this transaction
    for item_data in data['items']:
        product_id = item_data['product_id']
        total_returned = db.session.query(db.func.sum(ReturnItem.quantity))\
            .join(Return)\
            .filter(Return.transaction_id == txn_id, ReturnItem.product_id == product_id)\
            .scalar() or 0
        item_data['returned_quantity'] = int(total_returned)

    return jsonify(data), 200


@app.route('/api/returns', methods=['POST'])
@jwt_required()
def create_return():
    """Process a return: validate, reverse stock, persist to DB."""
    data = request.get_json()
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    txn_id = data.get('transaction_id')
    txn = Transaction.query.get(txn_id)
    if not txn:
        return jsonify({"msg": "Original transaction not found"}), 404

    items = data.get('items', [])  # [{product_id, quantity, unit_price}]
    if not items:
        return jsonify({"msg": "No items selected for return"}), 400

    reason = data.get('reason', '')
    refund_method = data.get('refund_method', '')
    subtotal = data.get('subtotal', 0.0)
    tax = data.get('tax', 0.0)
    total = data.get('total', 0.0)

    # Safety Check: Ensure total refunds don't exceed original transaction total
    total_refunded_so_far = db.session.query(db.func.sum(Return.total))\
        .filter(Return.transaction_id == txn_id)\
        .scalar() or 0
    
    if (total_refunded_so_far + total) > (txn.total + 0.01): # Adding small buffer for floating point
        return jsonify({
            "msg": f"Total refund amount (${total_refunded_so_far + total:.2f}) would exceed original transaction total (${txn.total:.2f})"
        }), 400

    try:
        new_return = Return(
            transaction_id=txn_id,
            user_id=user.id,
            reason=reason,
            refund_method=refund_method,
            subtotal=subtotal,
            tax=tax,
            total=total
        )
        db.session.add(new_return)
        db.session.flush()  # get the return id

        for item in items:
            product_id = item['product_id']
            qty = item['quantity']
            unit_price = item['unit_price']

            product = Product.query.get(product_id)
            if not product:
                db.session.rollback()
                return jsonify({"msg": f"Product ID {product_id} not found"}), 404

            # Validate qty against what was purchased in the original transaction
            original_item = next(
                (i for i in txn.items if i.product_id == product_id), None
            )
            if not original_item:
                db.session.rollback()
                return jsonify({"msg": f"Product {product.name} was not in the original transaction"}), 400
            
            # Sum up all previously returned quantities for this item
            total_previously_returned = db.session.query(db.func.sum(ReturnItem.quantity))\
                .join(Return)\
                .filter(Return.transaction_id == txn_id, ReturnItem.product_id == product_id)\
                .scalar() or 0
            
            remaining_returnable = original_item.quantity - total_previously_returned
            
            if qty > remaining_returnable:
                db.session.rollback()
                return jsonify({
                    "msg": f"Requested return for {product.name} ({qty}) exceeds remaining returnable quantity ({remaining_returnable})"
                }), 400

            # Reverse stock
            product.stock += qty

            return_item = ReturnItem(
                return_id=new_return.id,
                product_id=product_id,
                quantity=qty,
                unit_price=unit_price
            )
            db.session.add(return_item)

        db.session.commit()
        return jsonify(new_return.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Return error: {e}")
        return jsonify({"msg": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
