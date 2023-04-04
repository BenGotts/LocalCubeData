const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

const data = require('../data/db.json');

const router = express.Router();

// Define your models and routes here
router.get('/data', (req, res) => {
    res.status(200)
    res.send(data)
});

app.use('/api', router);

// app.listen(5000, () => {
//   console.log('Server running on port 5000');
// });

module.exports.handler = serverless(app);