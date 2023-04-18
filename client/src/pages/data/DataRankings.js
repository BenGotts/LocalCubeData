import React, { useState, useEffect } from 'react';
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

const DataRankings = () => {
  const [competitor, setCompetitor] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [attempts, setAttempts] = useState(Array(5).fill(''));

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => {
        setCompetitors(data.competitors.map((competitor) => `${competitor.name} (${competitor.id})`));
      });
      document.title = `${eventId} ${round} Data`;
  }, []);

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
    
  const handleSubmit = (e) => {
    e.preventDefault();

    // Data to be sent to the server
    const data = {
      competitor: selectedCompetitor,
      durations: attempts,
    };

    // Send data to the server
    fetch('/api/data/', {
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
    setSelectedCompetitor(null);
    setAttempts(Array(5).fill(''));
  };

  const single = 123;
  const average = 234;

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
      <Button variant="contained" color="primary" onClick={submitData}>
        Submit
      </Button>
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography variant="h6">Single: {single ? single : ""}</Typography>
      <Typography variant="h6">Average: {average ? average : ""}</Typography>
    </Box>
  </Box>  
  );
};

export default DataRankings;
