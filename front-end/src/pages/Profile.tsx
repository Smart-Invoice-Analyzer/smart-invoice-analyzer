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


const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user_id = useSelector ((state: RootState) => state.auth.userId);
  const [snackbarMessage,setSnackbarMessage] = useState('');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  
  const { darkMode, toggleDarkMode } = useDarkMode(); // Context'ten alındı

  const handleSaveProfile = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      surname: Yup.string().required('Surname is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    });
  
    const updatedProfile = {
      name,
      surname,
      email,
      password: newPassword,
    };
  
    try {
      // Yup ile doğrulama
      await schema.validate(updatedProfile, { abortEarly: false });
  
      if (newPassword === confirmNewPassword) {
        axios
          .post('http://localhost:5000/users/update', updatedProfile)
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
      
      navigate('/');
      // Hesabı silme işlemi burada
    }
  };

  const [name, setName] = useState<string | null>(useSelector((state: RootState) => state.auth.userName) || '');
  const [surname, setSurname] = useState<string | null>(useSelector((state: RootState) => state.auth.surname) || '');

  const email = useSelector((state: RootState) => state.auth.user);
  const [password,setPassword] = useState <string | null> (useSelector((state: RootState) => state.auth.password) || '');
 
  

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
              value={email}
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
                  type="password"
                  value={password}
                  variant="outlined"
                  disabled
                />
              </Grid>

        
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => (setNewPassword(e.target.value) ,setPassword(e.target.value) )}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmNewPassword}
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
