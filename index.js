const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(cors());

// Маълумоти аввалия барои эҳтиёт
let rates = { "TJS": 1, "USD": 0.091, "RUB": 8.5, "EUR": 0.084 };

// Маркери Travelpayouts-и шумо (агар лозим бошад, ин ҷо иваз мекунед)
const TP_MARKER = "https://unitiki.tpo.lu/dFpJkjq3"; 

// Функсия барои гирифтани қурби асъор аз API-и кушода
async function updateRates() {
    try {
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

// Санҷиши мавҷудияти файли languages.json пеш аз хондан
let translations = {};
try {
    translations = JSON.parse(fs.readFileSync('./languages.json', 'utf8'));
} catch (e) {
    console.log("Файли languages.json ёфт нашуд ё хато дорад, режими пешфарз истифода мешавад.");
}

app.get('/', (req, res) => {
    res.send("Авиа-сервер фаъол аст ва қурби асъор ва чиптаҳоро назорат мекунад!");
});

// API барои мобил ё веб (Қаблии шумо)
app.get('/api/config', (req, res) => {
    const lang = req.query.lang || 'tg';
    const currency = req.query.curr || 'TJS';

    const defaultSearch = (translations[lang] && translations[lang].search) ? translations[lang].search : "Ҷустуҷӯ";

    res.json({
        welcomeText: defaultSearch,
        rates: {
            current: currency,
            value: rates[currency] || 1
        },
        all_rates: rates 
    });
});

// ==========================================
// БАХШИ НАВ: API барои линкҳои чиптаҳои Поезд ва Автобус (Travelpayouts)
// ==========================================
app.get('/api/tickets/search', (req, res) => {
    const transportType = req.query.type; // 'train' ё 'bus'
    const origin = req.query.origin;       // Шаҳри баромад
    const destination = req.query.destination; // Шаҳри مقصد
    const date = req.query.date;           // Сана (масалан, 2026-11-20)

    if (!origin || !destination || !date || !transportType) {
        return res.status(400).json({ error: "Лутфан ҳамаи параметрҳоро пур кунед: type, origin, destination, date" });
    }

    let affiliateLink = "";

    // Сохтани Deep Link вобаста ба намуди нақлиёт
    if (transportType === 'train') {
        let targetUrl = `https://www.tutu.ru/poezda/rasp_d.php?nnst1=${encodeURIComponent(origin)}&nnst2=${encodeURIComponent(destination)}&date=${date}`;
        let encodedUrl = encodeURIComponent(targetUrl);
        affiliateLink = `https://tp.media/r?marker=${TP_MARKER}&trs=12345&p=1234&u=${encodedUrl}`;
    } 
    else if (transportType === 'bus') {
        let targetUrl = `https://unitiki.com/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&date=${date}`;
        let encodedUrl = encodeURIComponent(targetUrl);
        affiliateLink = `https://tp.media/r?marker=${TP_MARKER}&trs=12345&p=5678&u=${encodedUrl}`;
    } 
    else {
        return res.status(400).json({ error: "Намуди нақлиёт нодуруст аст. Танҳо 'train' ё 'bus' иҷозат дода мешавад." });
    }

    res.json({
        success: true,
        transport: transportType,
        route: { origin, destination, date },
        booking_url: affiliateLink
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
