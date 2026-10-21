import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello depuis le backend Node.js ! 🚀' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend en écoute sur http://0.0.0.0:${PORT}`);
});