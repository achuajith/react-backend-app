const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/image', (req, res) => {
  const imageUrl = 'https://kuttya1-4cl3-project.s3.us-east-2.amazonaws.com/hus.jpg';
  res.json({ imageUrl});
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});