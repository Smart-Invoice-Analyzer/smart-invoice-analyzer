import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CreateAccountInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateAccountForm: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  // Validation schema for the form
  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAccountInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CreateAccountInputs) => {
    // Axios POST request to create a new account
    axios.post('http://localhost:5000/users', {
      email: data.email,
      password: data.password
    })
    .then(response => {
      setSnackbarMessage('Account successfully created!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Redirect to login or home after account creation
      setTimeout(() => {
        navigate('/');
      }, 2000);
    })
    .catch(error => {
      console.error('Error creating account:', error);
      setSnackbarMessage('Error creating account. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />
        </Box>
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#01579b', color: '#fff', ':hover': { backgroundColor: '#0288d1' } }}>
          Create Account
        </Button>
      </form>
      
      {/* Snackbar for success/error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateAccountForm;
