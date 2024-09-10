import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';


const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.text,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 3),
}));

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {

    navigate('/home');
  };

  return (
    <StyledBox>
      <StyledTypography variant="h1">404</StyledTypography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Aradığınız sayfa bulunamadı!
      </Typography>
      <StyledButton variant="contained" color="info" onClick={goHome}>
        Ana Sayfaya Dön
      </StyledButton>
    </StyledBox>
  );
};

export default NotFoundPage;
