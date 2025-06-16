import React, { useState } from 'react';
import { Box, Grid, Typography, Button, TextField, IconButton, Divider, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../components/Modal/Modal';
import axios from 'axios';
import * as Yup from 'yup';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useDarkMode } from '../DarkMode/DarkModeContext';
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
    const colors = {
    light: {
      background: '#e0e0e0',
      text: '#000',
      card: '#fff',
      button: '#01579b',
      buttonText: '#fff'
    },
    dark: {
      background: '#444',
      text: '#e0e0e0',
      card: '#1e1e1e',
      button: '#888',
      buttonText: '#000'
    }
  };
  const theme = darkMode ? colors.dark : colors.light;

  const handleSaveProfile = async () => {
const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  email: Yup.string().email('Invalid email').required('Email is required'), // Changed new_email to email

  // Şifre alanları isteğe bağlı ama biri girildiyse, diğerleri zorunlu olur
  current_password: Yup.string().when('new_password', {
    is: (val: string) => !!val,
    then: (schema) =>
      schema.required('Current password is required').min(6, 'Must be at least 6 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),

  new_password: Yup.string()
    .nullable()
    .notRequired()
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%&*?]/, 'Must contain at least one special character')
    .min(8, 'Must be at least 8 characters'),

  confirm_password: Yup.string().oneOf([Yup.ref('new_password'), ''], 'Passwords must match'),
});


  
const updatedProfile: any = {
  name,
  surname,
  email,
  gender, // Assuming gender is already defined or fetched
  date_of_birth, // Assuming date_of_birth is already defined or fetched
  username
};

if (current_password || new_password || confirm_password) { // Only add password fields if any are being changed
  updatedProfile.current_password = current_password;
  updatedProfile.new_password = new_password;
  updatedProfile.confirm_password = confirm_password;
}
  
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
            setCurrentPassword(''); // Clear password fields on success
            setNewPassword('');
            setConfirmNewPassword('');
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
      // This part would typically involve an API call to delete the user
    }
  };

  const [name, setName] = useState<string | null>(useSelector((state: RootState) => state.auth.userName) || '');
  const [surname, setSurname] = useState<string | null>(useSelector((state: RootState) => state.auth.surname) || '');
  const [username, setUsername] = useState<string | null>(useSelector((state: RootState) => state.auth.username) || '');

  

  const [email, setEmail] = useState<string | null>(useSelector((state: RootState) => state.auth.user) || '');
  const gender = useSelector((state:RootState) => state.auth.gender);
  const date_of_birth = Number(useSelector((state:RootState) => state.auth.date_of_birth))
 
  

  return (
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' ,
        color: theme.text, minHeight: '100vh' }}> {/* Added minHeight for full page coverage */}
      
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
          width: '100%', // Ensure it takes full width
          boxSizing: 'border-box', // Include padding in width calculation
        }}
      >
      
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} toggleSidebar={toggleSidebar}/>

        <Grid container spacing={3} sx={{ marginTop: { xs: '20px', sm: '60px' } }}> {/* Adjusted margin top for small screens */}
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
              label="Username"
              value={username}
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)} 
              disabled // Keep disabled as per original
            
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              disabled // Keep disabled as per original
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

          <Grid item xs={12} sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on extra-small, row on small and up
            justifyContent: 'space-between', 
            gap: { xs: 2, sm: 3 }, // Add gap for spacing between stacked buttons
            marginTop: 3 
          }}>
            {editing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs, auto on sm
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditing(false)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs, auto on sm
                >
                  Cancel
                </Button>
              </>
            ) : (
              <> 
                <Box sx={{
                  display:"flex",
                  flexDirection: { xs: 'column', sm: 'row' }, // Stack on xs, row on sm
                  gap: { xs: '10px', sm: '20px' }, // Adjust gap for stacked buttons
                  width: { xs: '100%', sm: 'auto' } // Full width on xs
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    sx={{ flexGrow: 1 }} // Allow buttons to grow and fill space
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LockResetIcon />}
                    onClick={() => setEditing(true)}
                    sx={{ flexGrow: 1 }} // Allow buttons to grow and fill space
                  >
                    Change password
                  </Button>
                </Box>
                <IconButton color="error" onClick={handleDeleteAccount} sx={{ 
                  width: { xs: '100%', sm: 'auto' }, // Full width on xs, auto on sm
                  justifyContent: { xs: 'center', sm: 'flex-end' }, // Center icon and text on xs
                  borderRadius: { xs: '4px', sm: '50%' } // Make it a button shape on xs, circular on sm
                }}>
                  <DeleteIcon />
                  <Typography variant="button" color="error" sx={{ marginLeft: 1 }}>
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
          userId={user_id}         />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position snackbar responsively
        />
      </Box>
    </Box>
    
  );


};

export default ProfilePage;