import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Events = () => {
  const [events, setEvents] = useState({});
  const [eventNames, setEventNames] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/data`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data["events"]);
        setEventNames(data["allEvents"]);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Events List
      </Typography>
      <List>
        {Object.entries(events).map(([eventId, eventRounds]) => {
          return Object.entries(eventRounds).map(([round, roundData]) => (
            <ListItem
              key={`${eventId}-${round}`}
              component={Link}
              to={`/events/${eventId}/${round}`}
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
  
  export default Events;
  