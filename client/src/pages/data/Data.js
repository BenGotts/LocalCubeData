import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = 'https://cubedata.netlify.app';

const Data = () => {
  const [events, setEvents] = useState({});
  const [eventNames, setEventNames] = useState({});

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data["events"]);
        setEventNames(data["allEvents"]);
      });
      document.title = 'Events Data';
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Data Events List
      </Typography>
      <List>
        {Object.entries(events).map(([eventId, eventRounds]) => {
          return Object.entries(eventRounds).map(([round, roundData]) => (
            <ListItem
              key={`${eventId}-${round}`}
              component={Link}
              to={`/data/${eventId}/${round}`}
              button
            >
              <Box display="flex" alignItems="center">
                <span
                    className={`cubing-icon event-${eventId}`}
                    style={{ fontSize: "3em" }}
                  ></span>
                  <ListItemText
                    primary={
                      <Typography variant="h5" component="div" ml={2}>
                        {eventNames[eventId]}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle1" component="div" ml={2}>
                        {round.charAt(0).toUpperCase() + round.slice(1)}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
            ));
          })}
        </List>
      </div>
    );
  };
  
  export default Data;