import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const API_URL = 'https://cubedata.netlify.app';

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [competitorName, setCompetitorName] = useState('');

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => { setEvents(data['events']); setEventNames(data['allEvents'])});
  }, []);

  const handleAddCompetitor = () => {
    console.log('Add competitor:', competitorName, selectedEvents);
    // Add your logic to handle adding a competitor with the selected events
  };

  const handleCheckboxChange = (event) => {
    setSelectedEvents({ ...selectedEvents, [event.target.name]: event.target.checked });
  };

  const removeSelectedEvent = (eventId) => {
    const newSelectedEvents = { ...selectedEvents };
    delete newSelectedEvents[eventId];
    setSelectedEvents(newSelectedEvents);
  };

  const availableEvents = Object.entries(eventNames).filter(
    ([eventId]) => !selectedEvents[eventId] && eventId in events
  );

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Competition
        </Typography>
        <Box mt={3}>
          <form noValidate autoComplete="off">
            <TextField
              label="Competitor Name"
              variant="outlined"
              fullWidth
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" component="div" gutterBottom>
                  Selected Events
                </Typography>
                <FormGroup>
                  {Object.entries(selectedEvents)
                    .filter(([, selected]) => selected)
                    .map(([eventId, _]) => (
                      <FormControlLabel
                        key={eventId}
                        control={
                          <Checkbox
                            checked
                            onChange={() => removeSelectedEvent(eventId)}
                            name={eventId}
                          />
                        }
                        label={eventNames[eventId]}
                      />
                    ))}
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="div" gutterBottom>
                  Available Events
                </Typography>
                <FormGroup>
                  {availableEvents.map(([eventId, eventName]) => (
                    <FormControlLabel
                      key={eventId}
                      control={
                        <Checkbox
                          onChange={handleCheckboxChange}
                          name={eventId}
                        />
                      }
                      label={eventName}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCompetitor}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Add Competitor
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Admin;
