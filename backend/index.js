import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Le paramètre city est requis.' });
  }

  try {
    // 1. Géocodage
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: 'Ville introuvable.' });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Météo courante + prévisions 5 jours
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    res.json({
      city: name,
      country,
      current: weatherData.current,
      units: weatherData.current_units,
      daily: weatherData.daily,
      daily_units: weatherData.daily_units
    });
  } catch (error) {
    console.error('Erreur API météo :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données météo.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend météo en écoute sur le port ${PORT}`);
});