import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.primary.main,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 'bold',
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(2),
}));

const Home = () => {
  return (
    <StyledContainer maxWidth="xl">
      <StyledTitle variant="h1" component="h1">
        Welcome to Cubers Against Cancer 2023
      </StyledTitle>
      <Box>
        <StyledButton
          variant="contained"
          color="secondary"
          component={Link}
          to="/events"
        >
          View Events
        </StyledButton>
      </Box>
    </StyledContainer>
  );
};

export default Home;
