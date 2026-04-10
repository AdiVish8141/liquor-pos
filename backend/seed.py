from app import app
from models import db, User, Product , Customer

INITIAL_PRODUCTS = [
    {
        "name": "Jack Daniel's",
        "full_name": "Jack Daniel's Tennessee Whiskey",
        "sku": "820007645B",
        "price": 29.99,
        "stock": 32,
        "bg": "#ffe5d9",
        "category": "Whiskey",
        "volume": "750ml",
        "case_bottle": "12",
        "abv": "40%",
        "discount": 2.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True
    },
    {
        "name": "Absolut Vodka",
        "full_name": "Absolut Vodka",
        "sku": "820007645C",
        "price": 19.99,
        "stock": 18,
        "bg": "#e0f2fe",
        "category": "Vodka",
        "volume": "750ml",
        "case_bottle": "12",
        "abv": "40%",
        "discount": 0.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True
    },
    {
        "name": "Casamigos Blanco",
        "full_name": "Casamigos Blanco Tequila",
        "sku": "820007645D",
        "price": 49.99,
        "stock": 24,
        "bg": "#ecfccb",
        "category": "Tequila",
        "volume": "750ml",
        "case_bottle": "6",
        "abv": "40%",
        "discount": 5.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True
    },
    {
        "name": "Crown Royal",
        "full_name": "Crown Royal Blended Canadian Whisky",
        "sku": "820007645E",
        "price": 32.99,
        "stock": 45,
        "bg": "#f3e8ff",
        "category": "Whiskey",
        "volume": "750ml",
        "case_bottle": "12",
        "abv": "40%",
        "discount": 0.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True
    },
    {
        "name": "Smirnoff No. 21",
        "full_name": "Smirnoff No. 21 Vodka",
        "sku": "820007645F",
        "price": 15.99,
        "stock": 50,
        "bg": "#f1f5f9",
        "category": "Vodka",
        "volume": "750ml",
        "case_bottle": "12",
        "abv": "40%",
        "discount": 0.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True
    },
    {
        "name": "Maker's Mark",
        "full_name": "Maker's Mark Kentucky Straight Bourbon",
        "sku": "820007645G",
        "price": 28.99,
        "stock": 29,
        "bg": "#ffedd5",
        "category": "Whiskey",
        "volume": "750ml",
        "case_bottle": "6",
        "abv": "45%",
        "discount": 0.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True,
        "return_policy": "Returnable"
    },
    {
        "name": "Grand Marnier 100th",
        "full_name": "Grand Marnier 100th Anniversary Edition",
        "sku": "820007645H",
        "price": 149.99,
        "stock": 5,
        "bg": "#fde68a",
        "category": "Liqueur",
        "volume": "750ml",
        "case_bottle": "6",
        "abv": "40%",
        "discount": 0.00,
        "tax_category": "Liquor",
        "deposit": 0.10,
        "age_verified": True,
        "return_policy": "Manager Approval"
    }
]

def seed_db():
    with app.app_context():
        # Create tables
        db.create_all()

        # Seed Admin
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("Creating admin user...")
            new_admin = User(username='admin', full_name='Admin', role='ADMIN')
            new_admin.set_password('admin123')
            db.session.add(new_admin)

        # Seed Customers
        INITIAL_CUSTOMERS = [
            {
                "phone": "1234567890",
                "name": "John Doe",
                "email": "john@domin.com"
            },
            {
                "phone": "1234567891",
                "name": "Jane Doe",
                "email": "jane@domain.com"
            }
        ]

        for c_data in INITIAL_CUSTOMERS:
            existing = Customer.query.filter_by(phone=c_data['phone']).first()
            if not existing:
                print(f"Seeding customer: {c_data['phone']}")
                new_c = Customer(**c_data)
                db.session.add(new_c)
        
        # Seed Products
        for p_data in INITIAL_PRODUCTS:
            existing = Product.query.filter_by(sku=p_data['sku']).first()
            if not existing:
                print(f"Seeding product: {p_data['name']}")
                new_p = Product(**p_data)
                db.session.add(new_p)
            else:
                # Update stock if it exists for demo purposes
                existing.stock = p_data['stock']
        
        db.session.commit()
        print("Seeding complete!")

if __name__ == '__main__':
    seed_db()
