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


const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user_id = useSelector ((state: RootState) => state.auth.userId);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSaveProfile = () => {
    const updatedProfile = {
      name,
      surname,
      email,  
      password
    };
  
    axios.post('http://localhost:5000/users/update', updatedProfile)
      .then(response => {
        setSnackbarOpen(true);
        setEditing(false);
        // Başarılı bir şekilde kaydedildiğinde redux state'i de güncellenebilir.
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setSnackbarOpen(true);
      });
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
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main content */}
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
        {/* Topbar */}
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

        {/* Profile Section */}
        <Grid container spacing={3} marginTop={'60px'}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {editing ? 'Edit Profile' : 'Profile Information'}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
          </Grid>

          {/* Name Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={"Name"}
              value={name}
              variant="outlined"
              disabled={!editing}
              onChange={(e) => setName(e.target.value)} 
            />
          </Grid>

           {/* Name Field */}
           <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Surname"
              value={surname}
              variant="outlined"
              disabled={!editing}
              onChange={(e) => setSurname(e.target.value)} 
            
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              variant="outlined"
              disabled={!editing}
            />
          </Grid>

          {editing && (
            <>
              {/* Password Fields */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
              </Grid>

              {/* Current Password */}
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

              {/* New Password */}
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

              {/* Confirm New Password */}
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

          {/* Save and Edit/Delete Buttons */}
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
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
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

        {/* Snackbar for profile updates */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="Profile updated successfully"
        />
      </Box>
    </Box>
    
  );


};

export default ProfilePage;
