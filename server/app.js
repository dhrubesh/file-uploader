const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API working!');
});

const PORT = 5555;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
