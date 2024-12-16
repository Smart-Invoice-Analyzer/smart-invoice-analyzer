import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import LoginForm from '../components/Login/LoginForm';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';


const LoginPage: React.FC = () => {

  const navigate = useNavigate();
 
  

  return (
    <Grid container sx={{ height: '100vh' }}>
   
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: 'linear-gradient(to right, #01579b, #0288d1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        <Box sx={{ color: '#ffffff', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Welcome to Smart Invoice Analyzer
          </Typography>
          <Typography variant="h6" sx={{ mb: 5 }}>
            Easily scan, organize, and analyze your invoices in a smart way.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ffffff', color: '#01579b', ':hover': { backgroundColor: '#0288d1' } }}
          >
            Learn More
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="xs">
          <Box
            sx={{
              padding: 4,
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#01579b' }}>
              Login
            </Typography>
            <LoginForm />
            <Box mt={4}>
              <Typography variant="body1" align="center">
                Don't have an account?
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ marginTop: '10px', borderColor: '#01579b', color: '#01579b' }}
                onClick={() => navigate('/create')}
              >
                Create an Account
              </Button>
            </Box>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
