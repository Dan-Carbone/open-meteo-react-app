import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then((res) => res.json())
      .then((resData) => setData(resData.message))
      .catch((err) => console.error('Erreur API:', err));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Frontend React</h1>
      <p>Message reçu du backend :</p>
      <strong style={{ color: '#0070f3', fontSize: '1.2rem' }}>
        {data || 'Chargement...'}
      </strong>
    </div>
  );
}

export default App;