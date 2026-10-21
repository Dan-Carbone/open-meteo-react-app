import { useState } from 'react';

// Fonction pour traduire les codes WMO d'Open-Meteo
function getWeatherDesc(code) {
  const codes = {
    0: 'Ciel dégagé ☀️',
    1: 'Principalement dégagé 🌤️',
    2: 'Partiellement nuageux ⛅',
    3: 'Couvert ☁️',
    45: 'Brouillard 🌫️',
    51: 'Bruine légère 🌦️',
    61: 'Pluie faible 🌧️',
    63: 'Pluie modérée 🌧️',
    65: 'Forte pluie 🌧️',
    71: 'Chute de neige ❄️',
    95: 'Orage ⛈️'
  };
  return codes[code] || 'Météo variable 🌤️';
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', textAlign: 'center', padding: '0 20px' }}>
      <h1>Météo en direct 🌍</h1>

      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Ex: Paris, Tokyo, Marseille..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 18px', fontSize: '1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {loading ? '...' : 'Chercher'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {weather && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2>{weather.city}, {weather.country}</h2>
          <p style={{ fontSize: '1.4rem', margin: '10px 0', fontWeight: 'bold' }}>
            {getWeatherDesc(weather.current.weather_code)}
          </p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '15px 0', color: '#0070f3' }}>
            {weather.current.temperature_2m}{weather.units.temperature_2m}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', color: '#666', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <div>Ressenti : <strong>{weather.current.apparent_temperature}{weather.units.apparent_temperature}</strong></div>
            <div>Humidité : <strong>{weather.current.relative_humidity_2m}{weather.units.relative_humidity_2m}</strong></div>
            <div>Vent : <strong>{weather.current.wind_speed_10m} {weather.units.wind_speed_10m}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;