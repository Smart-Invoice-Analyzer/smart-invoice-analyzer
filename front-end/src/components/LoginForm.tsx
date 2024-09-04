import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import '../styles/Login.css'
interface User {
  email: string;
  name: string;
}

interface LoginFormInputs {
  email: string;
}

const LoginForm: React.FC = () => {
  const [validUsers, setValidUsers] = useState<User[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setValidUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    const user = validUsers.find(user => user.email === data.email);
    if (user) {
      dispatch(login({ email: user.email, name: user.name }));
      navigate('/home');
    } else {
      setOpenSnackbar(true);
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
        <TextField
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
        label = "Password"
        fullWidth
        />
        
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={4000}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          Incorrect email.
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
