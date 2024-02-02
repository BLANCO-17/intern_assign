const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); 

app.post('/getWeather', async (req, res) => {

    try {
        const { cities } = req.body;
        console.log(req.body);

        if (!cities || !Array.isArray(cities) || cities.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Need an array of cities.' });
        }

        const weatherPromises = cities.map(city => getWeather(city));
        const weatherResults = await Promise.all(weatherPromises);

        const weatherData = {};
        weatherResults.forEach((result, index) => {
        const city = cities[index];
        weatherData[city] = result;
        });

        res.json({ weather: weatherData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getWeather(city) {
    try {
        const apiKey = 'e8a5605e3144dc8a7cbfca7ce1b3040e';
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&q=${city}`;
        // "api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=e8a5605e3144dc8a7cbfca7ce1b3040e"

        const response = await axios.get(weatherApiUrl);
        const temperatureK = response.data.main.temp;
        const temperatureCelsius = temperatureK - 273.15;

        // console.log(`${temperatureCelsius.toFixed(2)}°C`);
        return `${temperatureCelsius.toFixed(2)}°C`;
    } catch (error) {
        console.error(`Failed to fetch weather for ${city}. Error: ${error.message}`);
        return 'N/A';
    }
}

app.listen(PORT, () => {
    console.log(`Weather Server is running on http://localhost:${PORT}`);
});
