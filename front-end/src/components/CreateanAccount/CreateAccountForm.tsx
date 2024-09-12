import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface CreateAccountInputs {
  
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateAccountForm: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading,setLoading] = useState (false);
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  // Validation schema for the form
  const schema = Yup.object().shape({
    
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    username: Yup.string().required('Username is required'),
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

    const userId = Math.floor(Math.random() * 1000000);

    // Axios POST request to create a new account
    axios.post('http://localhost:5000/users', {
      userId,
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      password: data.password
    }, { withCredentials: true })
    .then((response) => {
      // Set loading state to true
      setLoading(true);
      setSnackbarMessage('Account successfully created!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/');
      setHidden(true);
    
     
    })
    
    
    .catch(error => {
      if (error.response && error.response.status === 400) {
        setSnackbarMessage('Email or Username already exists.');
      } else {
        setSnackbarMessage('Error creating account. Please try again.');
      }
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
            label="Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            hidden ={hidden}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Surname"
            {...register('surname')}
            error={!!errors.surname}
            helperText={errors.surname?.message}
            fullWidth
            hidden ={hidden}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth
            hidden ={hidden}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            hidden ={hidden}
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
            hidden ={hidden}
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
            hidden ={hidden}
          />
        </Box>
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#01579b', color: '#fff', ':hover': { backgroundColor: '#0288d1' } }}>
        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
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
