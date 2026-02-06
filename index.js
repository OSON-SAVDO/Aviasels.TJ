const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(cors());

// Маълумоти аввалия барои эҳтиёт
let rates = { "TJS": 1, "USD": 0.091, "RUB": 8.5, "EUR": 0.084 };

// Функсия барои гирифтани қурби асъор аз API-и кушода
async function updateRates() {
    try {
        // Мо аз API-и ройгони ExchangeRate-API истифода мебарем (ё ягон API-и дигар)
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TJS');
        rates = response.data.rates;
        console.log("Қурби асъор нав шуд:", rates);
    } catch (error) {
        console.error("Хатогӣ дар навсозии асъор:", error.message);
    }
}

// Навсозии асъор ҳангоми ба кор даромадани сервер
updateRates();
// Навсозии асъор ҳар 1 соат
setInterval(updateRates, 3600000);

const translations = JSON.parse(fs.readFileSync('./languages.json', 'utf8'));

app.get('/', (req, res) => {
    res.send("Авиа-сервер фаъол аст ва қурби асъорро назорат мекунад!");
});

// API барои мобил ё веб
app.get('/api/config', (req, res) => {
    const lang = req.query.lang || 'tg';
    const currency = req.query.curr || 'TJS';

    res.json({
        welcomeText: translations[lang] ? translations[lang].search : translations['tg'].search,
        rates: {
            current: currency,
            value: rates[currency] || 1
        },
        all_rates: rates // Ҳамаи қурбҳо барои санҷиш
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
