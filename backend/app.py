import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from dotenv import load_dotenv
from models import db, User, Product, Customer, Transaction, TransactionItem

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
                unit_price=item['price']
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
            email=data.get('email')
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify(new_customer.to_dict()), 201
    
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers]), 200

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
