const express = require('express');
const app = express();
const port = 3000; // Use a port other than 5000

app.get('/ping', (req, res) => {
  res.status(200).send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});