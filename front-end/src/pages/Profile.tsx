import React, { useState } from 'react';
import { Box, Grid, Typography, Button, TextField, IconButton, Divider, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../components/Modal/Modal';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import api from '../api/api';
import { api_url } from '../api/apiconfig';

const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [editing, setEditing] = useState(false);
  const [new_password, setNewPassword] = useState('');
  const [current_password,setCurrentPassword] = useState('');
  const [confirm_password, setConfirmNewPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user_id = useSelector ((state: RootState) => state.auth.user_id);
  const [snackbarMessage,setSnackbarMessage] = useState('');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const token = useSelector((state: RootState) => state.auth.token)
  
  const { darkMode, toggleDarkMode } = useDarkMode(); // Context'ten alındı

  const handleSaveProfile = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      surname: Yup.string().required('Surname is required'),
      new_email: Yup.string().email('Invalid email').required('Email is required'),
      current_password: Yup.string().min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
      new_password: Yup.string().min(8, 'Password must be at least 8 characters')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/[!@#$%&*?]/, 'Password must contain at least one special character (!, @, #, $, %, &, *, ?)')
          .required('Password is required'),
      confirm_password: Yup.string()
              .oneOf([Yup.ref('new_password'), undefined], 'Passwords must match')
              .required('Confirm password is required'),
      
    });
  
    const updatedProfile = {
      name,
      surname,
      new_email,
      gender,
      date_of_birth,
      current_password,
      confirm_password,
      new_password,

      
    };
  
    const config = {
  headers: {
    Authorization: `Bearer ${token}` // Correctly formatted token
  }
};

    try {
      
      await schema.validate(updatedProfile, { abortEarly: false });
  
      if (new_password === confirm_password) {
        axios
          .put(`${api_url}/users/update_user`, updatedProfile,config)
          .then((response) => {
            setSnackbarMessage('Profile updated successfully.');
            setSnackbarOpen(true);
            setEditing(false);
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
            setSnackbarMessage('Error updating profile.');
            setSnackbarOpen(true);
          });
      } else {
        setSnackbarMessage('Passwords did not match.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setSnackbarMessage(error.errors.join(', ')); // Tüm doğrulama hatalarını göster
        setSnackbarOpen(true);
      } else {
        console.error('Unexpected validation error:', error);
      }
    }
  };
  



  const handleDeleteAccount = () => {
    
   setIsModalOpen(true);
    
  };

  const handleModalClose = (confirmed: boolean) => {
    setIsModalOpen(false);
    if (confirmed) {
      
     
      // Hesabı silme işlemi burada
    }
  };

  const [name, setName] = useState<string | null>(useSelector((state: RootState) => state.auth.userName) || '');
  const [surname, setSurname] = useState<string | null>(useSelector((state: RootState) => state.auth.surname) || '');

  const new_email = useSelector((state: RootState) => state.auth.user);
  const gender = useSelector((state:RootState) => state.auth.gender);
  const date_of_birth = Number(useSelector((state:RootState) => state.auth.date_of_birth))
 
  

  return (
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        
        toggleSidebar={toggleSidebar}
        
      />

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: darkMode ? '#444' : '#e0e0e0',
          padding: 3,
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' },
          position: 'relative',
         
        }}
      >
      
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

        <Grid container spacing={3} marginTop={'60px'}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {editing ? 'Edit Profile' : 'Profile Information'}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={"Name"}
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)} 
            />
          </Grid>

           <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Surname"
              value={surname}
              variant="outlined"
              onChange={(e) => setSurname(e.target.value)} 
            
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={new_email}
              variant="outlined"
            />
          </Grid>

          {editing && (
            <>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
              </Grid>

      
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type='password'
                  value={current_password}
                  onChange={(e) => (setCurrentPassword(e.target.value) )}
                  variant="outlined"
                  
                />
              </Grid>

        
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={new_password}
                  onChange={(e) => (setNewPassword(e.target.value) )}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirm_password}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            {editing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <> <Box sx={{display:"flex",gap:"20px"}}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LockResetIcon />}
                  onClick={() => setEditing(true)}
                >
                  Change password
                </Button> </Box>
                <IconButton color="error" onClick={handleDeleteAccount}>
                  <DeleteIcon />
                  <Typography variant="button" color="error">
                    Delete Account
                  </Typography>
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>

        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleModalClose} 
          userId={user_id}        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </Box>
    
  );


};

export default ProfilePage;
