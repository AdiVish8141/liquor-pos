
from app import app, db
from models import Product

# Mapping of Product Name keyword to Image Filename
image_map = {
    "Jack Daniel's": "/images/products/jack_daniels.png",
    "Absolut": "/images/products/absolut_vodka.png",
    "Casamigos": "/images/products/casamigos_blanco.png",
    "Crown Royal": "/images/products/crown_royal.png",
    "Smirnoff": "/images/products/smirnoff.png",
    "Maker's Mark": "/images/products/makers_mark.png",
    "Grand Marnier": "/images/products/grand_marnier.png",
}

def update_images():
    with app.app_context():
        products = Product.query.all()
        updated_count = 0
        for p in products:
            for key, path in image_map.items():
                if key.lower() in p.name.lower():
                    p.image_url = path
                    updated_count += 1
                    print(f"Updated {p.name} with image {path}")
                    break
        db.session.commit()
        print(f"Total updated: {updated_count} products.")

if __name__ == "__main__":
    update_images()
