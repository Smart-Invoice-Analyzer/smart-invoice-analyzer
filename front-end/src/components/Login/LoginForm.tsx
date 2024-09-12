
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Snackbar, Alert, Box, circularProgressClasses, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import 'C://Users//f.bayramov//Desktop//smart-invoice-analyzer//front-end//src//styles//Login.css';

export interface User {
  email: string;
  name: string;
  surname: string;
  password: string;
  username: string;
  userId: string;
}

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [validUsers, setValidUsers] = useState<User[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading,setLoading] = useState (false);

  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<User[]>('/usersdata.json')
      .then(response => {
        setValidUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    const user = validUsers.find(user => user.email === data.email);
    const pass = validUsers.find(user => user.password === data.password)
    setLoading(true);
    if (user && pass) {
      
      setTimeout(() => {
        dispatch(login({ 
           email: user.email,
           name: user.name, 
           password: user.password,
           username: user.username,
           surname: user.surname,
           userId: user.userId}));

      navigate('/home');
      setLoading(false);
      }, 2000);
      
    } else {
      setTimeout(() => {
        setLoading(false);
        setOpenSnackbar(true);
      }, 2000);
      setOpenSnackbar(false);
      
    }
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
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
            sx={{ borderColor: '01579b' }}
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
            sx={{ borderColor: '01579b' }}
          />
        </Box>
        <Button type="submit" variant="contained" fullWidth 
                sx={{ backgroundColor: '#01579b', color: '#fff', ':hover': { backgroundColor: '#596e60' } }}
                disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          
        </Button>
      </form>
      <Snackbar open={openSnackbar} >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Incorrect email or password.
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
