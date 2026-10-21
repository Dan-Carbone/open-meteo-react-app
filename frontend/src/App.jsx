import { useState } from 'react';
import WeatherChart from './WeatherChart';

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
  return codes[code] || 'Variable 🌤️';
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

      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center' }}>Météo & Prévisions 🌍</h1>

      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Ex: Lyon, Marseille, Montréal..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 18px', fontSize: '1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {loading ? '...' : 'Rechercher'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '6px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {weather && (
        <div>
          {/* Météo actuelle */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#fafafa' }}>
            <h2>{weather.city}, {weather.country}</h2>
            <div style={{ fontSize: '1.2rem', margin: '6px 0' }}>{getWeatherDesc(weather.current.weather_code)}</div>
            <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#0070f3' }}>
              {weather.current.temperature_2m}{weather.units.temperature_2m}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#666', marginTop: '10px' }}>
              <span>Ressenti : {weather.current.apparent_temperature}{weather.units.apparent_temperature}</span>
              <span>Humidité : {weather.current.relative_humidity_2m}%</span>
              <span>Vent : {weather.current.wind_speed_10m} {weather.units.wind_speed_10m}</span>
            </div>
          </div>

          {/* Grille 5 jours */}
          <h3 style={{ marginTop: '30px', marginBottom: '12px' }}>Prévisions sur 5 jours</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px' }}>
            {weather.daily.time.map((date, idx) => (
              <div key={date} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px', textAlign: 'center', background: '#fff' }}>
                <strong style={{ fontSize: '0.85rem' }}>
                  {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </strong>
                <div style={{ fontSize: '1.2rem', margin: '6px 0' }}>
                  {getWeatherDesc(weather.daily.weather_code[idx]).split(' ').pop()}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ff5722' }}>{weather.daily.temperature_2m_max[idx]}°</div>
                <div style={{ fontSize: '0.85rem', color: '#0070f3' }}>{weather.daily.temperature_2m_min[idx]}°</div>
              </div>
            ))}
          </div>

          {/* Graphique */}
          <WeatherChart daily={weather.daily} units={weather.daily_units} />
        </div>
      )}
    </div>
  );
}

export default App;