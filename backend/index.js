import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route de recherche météo par nom de ville
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Le paramètre city est requis.' });
  }

  try {
    // 1. Géocodage : nom de la ville -> coordonnées GPS
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: 'Ville introuvable.' });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Météo : récupération des données courantes
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    res.json({
      city: name,
      country,
      coordinates: { latitude, longitude },
      current: weatherData.current,
      units: weatherData.current_units
    });
  } catch (error) {
    console.error('Erreur API météo :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données météo.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend météo en écoute sur le port ${PORT}`);
});