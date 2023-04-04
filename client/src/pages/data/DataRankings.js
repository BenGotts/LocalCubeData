import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Grid,
} from '@mui/material';

const API_URL = 'https://cubedata.netlify.app';

const DataRankings = () => {
  const [competitor, setCompetitor] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [attempts, setAttempts] = useState(Array(5).fill(''));

  useEffect(() => {
    fetch(`${API_URL}/api/data`)
      .then((response) => response.json())
      .then((data) => {
        setCompetitors(data.competitors.map((competitor) => `${competitor.name} (${competitor.id})`));
      });
  }, []);

  const parseDuration = (value) => {
    if (value.toLowerCase() === 'dnf') return -1;
    if (value.toLowerCase() === 'dns') return -2;

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
    fetch(`${API_URL}/api/data/`, {
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
    </Box>
  );
};

export default DataRankings;
