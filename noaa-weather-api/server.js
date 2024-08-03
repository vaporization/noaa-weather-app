// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let alerts = [];

// Endpoint to create an alert
app.post('/api/alerts', (req, res) => {
    const alert = req.body;
    alerts.push(alert);
    res.status(201).json(alert);
});

// Endpoint to get all alerts
app.get('/api/alerts', (req, res) => {
    res.json(alerts);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
