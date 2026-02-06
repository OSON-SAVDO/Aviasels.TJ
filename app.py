import requests
from flask import Flask, render_template, request

app = Flask(__name__)

# МАЪЛУМОТИ ХУДРО ИН ҶО ГУЗОРЕД
API_TOKEN = "71876b59812fee6e1539f9365e6a12dd"
MARKER = "701004"

@app.route('/')
def index():
    return render_template('index.html', flights=[])

@app.route('/search', methods=['POST'])
def search():
    origin = request.form.get('from', '').strip()
    destination = request.form.get('to', '').strip()
    
    # Дархост ба API-и Travelpayouts (Нархҳои арзонтарин)
    # Диққат: Коди шаҳрҳо бояд бо формат IATA бошад (масалан DYU барои Душанбе)
    url = f"https://api.travelpayouts.com/v2/prices/latest"
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
        flights = data.get('data', [])
    except Exception as e:
        print(f"Хатогии API: {e}")
        flights = []
        
    return render_template('index.html', flights=flights)

if __name__ == '__main__':
    app.run(debug=True)
