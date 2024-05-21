const express = require('express');
const app = express();
const port = 4040;

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Hello name route
app.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
