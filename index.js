const express = require('express');
const converter = require('./src/converter'); // Import your converter logic
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Temperature Converter API is running. Try /convert?c=100');
});

// New endpoint to use your converter
app.get('/convert', (req, res) => {
  if (req.query.c) {
    const celsius = parseFloat(req.query.c);
    const fahrenheit = converter.celsiusToFahrenheit(celsius);
    const kelvin = converter.celsiusToKelvin(celsius);
    res.json({ celsius, fahrenheit, kelvin });
  } else {
    res.status(400).send('Error: Please provide a Celsius value using ?c=<value>');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});