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

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

const { db } = require('../src/firebase');

const allEvents = require('./data/allEvents.json');

app.use(express.json());
app.use(cors());

function calculateAverage(attempts) {
    const filteredAttempts = attempts.filter((a) => a > 0);
  
    // Sort attempts in ascending order
    const sortedAttempts = filteredAttempts.slice().sort((a, b) => a - b);
  
    if (sortedAttempts.length < 4) {
        return 'DNF';
    } else if (sortedAttempts.length == 4) {
        sortedAttempts.shift();
    } else {
        sortedAttempts.pop();
        sortedAttempts.shift();
    }
  
    // Calculate the average of the middle 3
    const sum = sortedAttempts.reduce((acc, cur) => acc + cur, 0);
    const average = sum / 3;
  
    // Return the average rounded to 2 decimal places
    return average.toFixed(2);
}
  
// Your Express routes and middleware
app.get('/api/data', async (req, res) => {
    try {
      const competitorsSnapshot = await db.collection('competitors').get();
      const competitors = competitorsSnapshot.docs.map(doc => doc.data());
  
      const eventsSnapshot = await db.collection('events').get();
      const events = {};
      await Promise.all(eventsSnapshot.docs.map(async doc => {
        const eventId = doc.id;
        const roundsSnapshot = await doc.ref.collection('rounds').get();
        const roundsData = {};
        roundsSnapshot.docs.forEach(roundDoc => {
          roundsData[roundDoc.id] = roundDoc.data().results;
        });
        events[eventId] = roundsData;
      }));
  
      res.json({ competitors, events, allEvents });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

  app.post('/api/data/submit', async (req, res) => {
    const { competitorId, eventId, round, attempts, bestSingle, average } = req.body;
  
    try {
      // Get competitor reference
      const competitorRef = db.collection('competitors').doc(String(competitorId));
  
      // Update competitor's events if necessary
      const competitorDoc = await competitorRef.get();
      if (!competitorDoc.exists || !competitorDoc.data().events.includes(eventId)) {
        await competitorRef.update({
          events: firebase.firestore.FieldValue.arrayUnion(eventId)
        });
      }
  
      // Add the results to the appropriate event and round
      const roundRef = db.collection('events').doc(eventId).collection('rounds').doc(round);
      await roundRef.update({
        results: firebase.firestore.FieldValue.arrayUnion({
          competitorId,
          attempts,
          bestSingle,
          average
        })
      });
  
      res.status(200).json({ message: 'Data submitted successfully' });
    } catch (error) {
      console.error('Error submitting data:', error);
      res.status(500).json({ message: 'Error submitting data' });
    }
  });
  
  

// Export the handler for the Netlify Function
module.exports.handler = serverless(app);
