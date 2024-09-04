import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css'

const LoginPage: React.FC = () => {
  return (
    <Container className=''>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom className='font'>
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
