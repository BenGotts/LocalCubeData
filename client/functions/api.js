// const express = require('express');
// const cors = require('cors');
// const serverless = require('serverless-http');

// const app = express();
// app.use(express.json());
// // app.use(cors());
// // app.use(bodyParser.json());

// const data = require('../server/data/db.json');

// const router = express.Router();

// // Define your models and routes here
// router.get('/data', (req, res) => {
//     res.status(200)
//     res.send(data)
// });

// app.use('/api', router);

// // app.listen(5000, () => {
// //   console.log('Server running on port 5000');
// // });

// module.exports.handler = serverless(app);

const fs = require('fs');
const path = require('path');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

const data = require('./data/db.json');

app.use(cors());

// Your Express routes and middleware
app.get('/api/data', (req, res) => {
    res.status(200)
    res.send(data)
});

app.post('/api/data/submit', (req, res) => {
    const { competitorId, eventId, round, attempts } = req.body;
  
    // Read data from the JSON file
    const dataFilePath = path.join(__dirname, 'data', 'db.json');
    const rawData = fs.readFileSync(dataFilePath);
    const data = JSON.parse(rawData);
  
    // Check if the competitor exists
    const competitor = data.competitors.find(c => c.id === competitorId);
  
    // If the competitor doesn't exist, add a new competitor
    if (!competitor) {
      const newCompetitor = {
        id: competitorId,
        name: req.body.name,
        events: `${eventId}`,
      };
      data.competitors.push(newCompetitor);
    }
  
    // Add the results to the appropriate event and round
    const event = data.events[eventId] || {};
    const roundData = event[round] || [];
    const bestSingle = Math.min(...attempts.filter(attempt => attempt > 0));
    // const average = /* calculate the average here */;
  
    roundData.push({
      name: req.body.name,
      attempts,
      bestSingle,
      average,
    });
  
    event[round] = roundData;
    data.events[eventId] = event;
  
    // Save the updated data back to the JSON file
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, updatedData);
  
    res.status(200).json({ message: 'Data submitted successfully' });
  });
  

// Export the handler for the Netlify Function
module.exports.handler = serverless(app);
