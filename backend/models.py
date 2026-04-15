from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(20), default='CASHIER') # ADMIN, MANAGER, CASHIER
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "role": self.role
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    bg = db.Column(db.String(20), default='#f1f5f9')
    category = db.Column(db.String(50), nullable=False)
    volume = db.Column(db.String(20))
    case_bottle = db.Column(db.String(20)) # Changed caseBottle to case_bottle for snake_case
    abv = db.Column(db.String(10))
    discount = db.Column(db.Float, default=0.0)
    tax_category = db.Column(db.String(50), default='Liquor')
    deposit = db.Column(db.Float, default=0.0)
    age_verified = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(500), nullable=True)
    return_policy = db.Column(db.String(50), default='Returnable') # Returnable, Manager Approval, Final Sale
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "fullName": self.full_name,
            "sku": self.sku,
            "price": self.price,
            "stock": self.stock,
            "bg": self.bg,
            "category": self.category,
            "volume": self.volume,
            "caseBottle": self.case_bottle,
            "abv": self.abv,
            "discount": self.discount,
            "taxCategory": self.tax_category,
            "deposit": self.deposit,
            "ageVerified": self.age_verified,
            "image_url": self.image_url,
            "return_policy": self.return_policy
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    age_verified_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "phone": self.phone,
            "name": self.name,
            "email": self.email,
            "age": self.age,
            "age_verified_at": self.age_verified_at.isoformat() if self.age_verified_at else None
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    subtotal = db.Column(db.Float, nullable=False)
    tax = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False) # CASH, CARD, GIFT_CARD
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    items = db.relationship('TransactionItem', backref='transaction', lazy=True)
    customer = db.relationship('Customer', backref='transactions')
    returns = db.relationship('Return', backref='transaction_record', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else "Walk-in",
            "customer_age": self.customer.age if self.customer else None,
            "subtotal": self.subtotal,
            "tax": self.tax,
            "discount": self.discount,
            "total": self.total,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat(),
            "items": [item.to_dict() for item in self.items],
            "returns": [r.to_dict() for r in self.returns]
        }

class TransactionItem(db.Model):
    __tablename__ = 'transaction_items'
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.BigInteger, db.ForeignKey('transactions.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False) # Gross price at time of sale
    unit_discount = db.Column(db.Float, default=0.0) # Discount applied per unit
    product = db.relationship('Product')

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else None,
            "product_sku": self.product.sku if self.product else None,
            "return_policy": self.product.return_policy if self.product else "Returnable",
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "unit_discount": self.unit_discount
        }


class Return(db.Model):
    __tablename__ = 'returns'
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.BigInteger, db.ForeignKey('transactions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    refund_method = db.Column(db.String(50), nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    tax = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('ReturnItem', backref='return_record', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_id": self.transaction_id,
            "reason": self.reason,
            "refund_method": self.refund_method,
            "subtotal": self.subtotal,
            "tax": self.tax,
            "total": self.total,
            "created_at": self.created_at.isoformat(),
            "items": [item.to_dict() for item in self.items]
        }


class ReturnItem(db.Model):
    __tablename__ = 'return_items'
    id = db.Column(db.Integer, primary_key=True)
    return_id = db.Column(db.Integer, db.ForeignKey('returns.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    product = db.relationship('Product')

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "Unknown",
            "quantity": self.quantity,
            "unit_price": self.unit_price
        }
