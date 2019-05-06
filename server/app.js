const express = require('express');
const app = express();

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('API working!');
});

app.post('/upload-file', function(req, res, next) {
  setTimeout(() => {
    res.json({ success: true });
  }, 2000);
});

const PORT = 5555;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
