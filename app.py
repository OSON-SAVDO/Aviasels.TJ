import requests
from flask import Flask, render_template, request

app = Flask(__name__)

# МАЪЛУМОТИ ХУДРО ДАР ИН ҶО ДАҚИҚ ГУЗОРЕД
API_TOKEN = "71876b59812fee6e1539f9365e6a12dd"  # Калиди шумо аз Travelpayouts
MARKER = "701004"      # Маркери шумо

# Луғат барои табдили шаҳрҳо ба кодҳои IATA
CITY_CODES = {
    "душанбе": "DYU",
    "хуҷанд": "LBD",
    "москва": "MOW",
    "истанбул": "IST",
    "дубай": "DXB",
    "алмато": "ALA"
}

@app.route('/')
def index():
    return render_template('index.html', flights=None)

@app.route('/search', methods=['POST'])
def search():
    from_input = request.form.get('from', '').strip().lower()
    to_input = request.form.get('to', '').strip().lower()
    
    # Агар шаҳр дар луғат бошад, кодашро мегирем, варна худи навиштаҷотро (агар IATA бошад)
    origin = CITY_CODES.get(from_input, from_input.upper())
    destination = CITY_CODES.get(to_input, to_input.upper())
    
    url = "https://api.travelpayouts.com/v2/prices/latest"
    params = {
        "origin": origin,
        "destination": destination,
        "token": API_TOKEN,
        "marker": MARKER,
        "currency": "tjs",
        "limit": 10
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        # API-и Travelpayouts маълумотро дар дохили ['data'] мефиристад
        flights = data.get('data', [])
    except Exception as e:
        print(f"Хатогии API: {e}")
        flights = []
        
    return render_template('index.html', flights=flights)

if __name__ == '__main__':
    app.run(debug=True)
