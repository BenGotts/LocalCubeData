const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

const data = require('./data/db.json');

// Define your models and routes here
app.get('/api/data', (req, res) => {
    res.status(200)
    res.send(data)
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
