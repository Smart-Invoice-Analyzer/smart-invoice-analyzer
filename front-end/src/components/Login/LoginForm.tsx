
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Button, Snackbar, Alert, Box, circularProgressClasses, CircularProgress, FormGroup, FormControlLabel, Checkbox, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import '../../../src/styles/Login.css';
import { CheckBox } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface User {
  email: string;
  name: string;
  surname: string;
  password: string;
  username: string;
  userId: string;
  gender: string;
  age: string;
}

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {

  const [validUsers, setValidUsers] = useState<User[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading,setLoading] = useState (false);
  const [savePassword, setSavePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

   useEffect(() => {
    // Fetch user data
    axios.get<User[]>('/usersdata.json')
      .then(response => {
        setValidUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    // Check for saved credentials
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setValue('email', savedEmail);
      setValue('password', savedPassword);
      setSavePassword(true);
    }
  }, []);

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const { register, handleSubmit, formState: { errors },setValue } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
  
    try {
      const response = await axios.post('https://smart-invoice-analyzer-server.onrender.com/users/login', {
        username_or_email: data.email, // API username veya email kabul ediyordu.
        password: data.password
      });
  
      if (response.status === 200) {
        const userData = response.data; // API'den dönen kullanıcı verisi
  
        if (savePassword) {
          localStorage.setItem('credentials', JSON.stringify(data));
        } else {
          localStorage.removeItem('credentials');
        }
  
        dispatch(login({
          email: userData.email,
          name: userData.name,
          surname: userData.surname,
          username: userData.username,
          userId: userData.userId,
          token: userData.token,
          password: '',
          age: userData.age,
          gender: userData.gender
        

        }));
  
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const savedCredentials = localStorage.getItem('credentials');
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      setValue('email', email);
      setValue('password', password);
      setSavePassword(true);
    }
  }, []);

  const handleSavePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSavePassword(event.target.checked);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ borderColor: '01579b' }}
          />
        </Box>
        <Button type="submit" variant="contained" fullWidth 
                sx={{ backgroundColor: '#01579b', color: '#fff', ':hover': { backgroundColor: '#596e60' } }}
                disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          
        </Button>
        <FormGroup>
  <FormControlLabel 
  control={<Checkbox 
  onChange={handleSavePasswordChange}/>} 
  label="Save password" />
</FormGroup>
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
