import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# МАЪЛУМОТИ ШУМО
API_TOKEN = "71876b59812fee6e1539f9365e6a12dd" 
MARKER = "701004"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    origin = request.form.get('from').upper()
    destination = request.form.get('to').upper()
    lang = request.form.get('lang', 'tg')
    
    url = "https://api.travelpayouts.com/v2/prices/latest"
    params = {
        "origin": origin,
        "destination": destination,
        "token": API_TOKEN,
        "marker": MARKER,
        "currency": "tjs",
        "show_to_affiliates": "true"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        flights = data.get('data', [])
        # Илова кардани линки пурра барои Aviasales
        for f in flights:
            f['buy_url'] = f"https://www.aviasales.tj{f['link']}&marker={MARKER}"
    except:
        flights = []
        
    return jsonify(flights)

if __name__ == '__main__':
    app.run(debug=True)
