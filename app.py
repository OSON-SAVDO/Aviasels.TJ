import os
import requests
from flask import Flask, render_template, request

app = Flask(__name__)

# Маълумоти API-и шумо
API_KEY = "71876b59812fee6e1539f9365e6a12dd"
API_ENDPOINT = "https://jet-tickets.com/?marker=701004"
MARKER = "701004"

@app.route('/')
def index():
    # Намоиши саҳифаи асосӣ бе натиҷаҳо
    return render_template('index.html', flights=[])

@app.route('/search', methods=['POST'])
def search():
    start_city = request.form.get('from', '').strip()
    end_city = request.form.get('to', '').strip()
    
    # Намунаи фиристодани дархост ба API (ин вобаста ба ҳуҷҷатҳои API-и шумо метавонад фарқ кунад)
    params = {
        'origin': start_city,
        'destination': end_city,
        'token': API_KEY,
        'marker': MARKER,
        'currency': 'tjs'
    }
    
    try:
        response = requests.get(API_ENDPOINT, params=params)
        data = response.json()
        # Ин ҷо мо бояд маълумотро мувофиқи сохтори API-и шумо формат кунем
        flights = data.get('data', []) 
    except Exception as e:
        print(f"Хатогӣ ҳангоми пайваст ба API: {e}")
        flights = []
    
    return render_template('index.html', flights=flights)

if __name__ == '__main__':
    app.run(debug=True)
