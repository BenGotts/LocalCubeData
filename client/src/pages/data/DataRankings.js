import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';

const API_URL = 'https://cubedata.netlify.app';

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

const DataRankings = () => {
  const { eventId, round } = useParams();
  const [competitor, setCompetitor] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [attempts, setAttempts] = useState(Array(5).fill(''));
  const [average, setAverage] = useState(0);
  const [single, setSingle] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((newData) => {
        setCompetitors(newData.competitors.map((competitor) => `${competitor.name} (${competitor.id})`));
        setData(newData);
      });
      document.title = `${eventId} ${round} Data`;
  }, []);

  useEffect(() => {
    console.log("HERE");
    if (attempts.length === 5) {
      const newBest = Math.min(...attempts.filter(attempt => attempt > 0));
      setSingle(newBest);
      setAverage(calculateAverage(attempts));
    }
  }, [attempts]);
  
  const submitData = () => {
    // const attempts = [attempt1, attempt2, attempt3, attempt4, attempt5];
    // const formattedData = {
    //   name: competitor,
    //   attempts: attempts.map((attempt) => attempt.value),
    // };
  
    fetch('/api/data/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    //   body: JSON.stringify(formattedData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };  

  const parseDuration = (value) => {
    if (value.toLowerCase() === 'dnf') return -1;
    if (value.toLowerCase() === 'dns') return 0;

    const timeRegex = /^(\d+):(\d{2}\.\d{2})$/;
    const match = value.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      return (minutes * 60 + seconds) * 100;
    }

    const seconds = parseFloat(value);
    if (!isNaN(seconds)) return seconds * 100;

    return null;
  };

  const handleDurationChange = (event) => {
    const { value } = event.target;
    const durationRegex = /^(([0-9]+):)?([0-9]{0,2}\.[0-9]{0,2}|[0-9]{0,2})?$/;
    const dnfDnsRegex = /^(D|DN)(S|F)?$/i;
  
    if (durationRegex.test(value) || dnfDnsRegex.test(value.toUpperCase())) {
      const updatedAttempts = [...attempts];
      updatedAttempts[Number(event.target.name)] = value;
      setAttempts(updatedAttempts);
    }
  };

  const renderAttempt = (attempt) => {
    if (attempt === -1) {
      return 'DNF';
    } else if (attempt === 0) {
      return 'DNS';
    } else {
      return formatTime(attempt);
    }
  };

  const formatTime = (centiseconds) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const fraction = centiseconds % 100;
    return minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, '0')}.${fraction.toString().padStart(2, '0')}`
      : `${seconds}.${fraction.toString().padStart(2, '0')}`;
  };
    
  const handleSubmit = (e) => {
    e.preventDefault();

    // Data to be sent to the server
    const data = {
      competitor: competitor,
      eventId: eventId,
      round: round,
      attempts: attempts.map(parseDuration),
      bestSingle: parseDuration(single),
      average: parseDuration(average),
    };

    // Send data to the server
    fetch('/api/data/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Data submitted:', result);
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });

    // Clear input fields after submission
    setCompetitor(null);
    setAttempts(Array(5).fill(''));
  };

  return (
  <Box>
    <Box display="flex" justifyContent="center">
      <Autocomplete
        sx={{ width: '50%' }} 
        options={competitors}
        freeSolo
        inputValue={competitor}
        onInputChange={(event, newValue) => setCompetitor(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Competitor Name" margin="normal"/>
        )}
      />
    </Box>
    <Grid container spacing={2} direction="column">
      {attempts.map((attempt, index) => (
        <Grid item key={index}>
          <Box display="flex" justifyContent="center">
            <TextField
              name={index.toString()}
              label={`Attempt ${index + 1}`}
              value={attempt}
              onChange={handleDurationChange}
              sx={{ width: '50%' }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
    <Box display="flex" justifyContent="center" mt={2}>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography variant="h6">Single: {single ? renderAttempt(single) : ""}</Typography>
      <Typography variant="h6">Average: {average ? renderAttempt(average) : ""}</Typography>
    </Box>
  </Box>  
  );
};

export default DataRankings;
