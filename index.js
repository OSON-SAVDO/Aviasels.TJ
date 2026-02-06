const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// Танзимоти асъор (барои оғоз)
const rates = {
    "TJS": 1,
    "USD": 0.092, // 1 TJS ба USD
    "RUB": 8.5,   // 1 TJS ба RUB
    "EUR": 0.085  // 1 TJS ба EUR
};

const translations = JSON.parse(fs.readFileSync('./languages.json', 'utf8'));

app.get('/', (req, res) => {
    res.send("Авиа-сервер фаъол аст!");
});

// API барои гирифтани маълумот
app.get('/api/config', (req, res) => {
    const lang = req.query.lang || 'tg';
    const currency = req.query.curr || 'TJS';

    res.json({
        welcomeText: translations[lang].search,
        currentRate: rates[currency],
        currencySymbol: currency
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
