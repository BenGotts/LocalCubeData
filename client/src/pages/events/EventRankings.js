import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Typography, Grid, useMediaQuery, Theme} from '@mui/material';

const API_URL = 'https://cubedata.netlify.app';

export default function EventRankings() {
  const { eventId, round } = useParams();
  const [rankings, setRankings] = useState([]);
  const [eventNames, setEventNames] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/data`)
      .then((response) => response.json())
      .then((data) => {
        setRankings(data['events'][eventId][round]);
        setEventNames(data['allEvents']);
      });
  }, []);

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

  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.up('sm')
  );

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2}>
        <span
          className={`cubing-icon event-${eventId}`}
          style={{ fontSize: '5em' }}
        ></span>
        <Typography variant="h3" component="div" ml={2}>
          {eventNames[eventId]} {round}
        </Typography>
      </Box>
      <Paper>
        <Box overflow="auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                {isLargeScreen && <TableCell>Attempts</TableCell>}
                <TableCell>Best Single</TableCell>
                <TableCell>Average</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((ranking, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{ranking.name}</TableCell>
                  {isLargeScreen && (
                  <TableCell>
                    <Grid container spacing={1}>
                      {ranking.attempts.map((attempt, idx) => (
                        <Grid item key={idx}>
                          {renderAttempt(attempt)}
                        </Grid>
                      ))}
                    </Grid>
                  </TableCell>)}
                  <TableCell>{renderAttempt(ranking.bestSingle)}</TableCell>
                  <TableCell>{renderAttempt(ranking.average)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </div>
  );
}
