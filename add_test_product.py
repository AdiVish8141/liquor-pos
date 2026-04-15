import urllib.request
import json

url = 'http://127.0.0.1:5000/api/products'
data = {
    "name": "Testing Aged Whiskey",
    "full_name": "Premium Aged Whiskey 750ml",
    "sku": "AGEVERIFY-005",
    "price": 89.99,
    "stock": 100,
    "category": "Whiskey",
    "volume": "750ml",
    "age_verified": True
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        chunk = response.read()
        print("Success:", chunk)
except Exception as e:
    print(e)
