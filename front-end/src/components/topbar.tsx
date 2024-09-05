// Topbar.tsx
import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

interface TopbarProps {
  sidebarOpen: boolean;
  darkMode: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, darkMode }) => {
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' },
      right: 0,
      backgroundColor: darkMode ? '#333' : '#f5f5f5',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 2,
      transition: 'left 0.3s',
    }}>
      {/* Search Bar */}
      <TextField
        placeholder="Search invoice"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { backgroundColor: '#fff', borderRadius: '50px', width: { xs: '100%', sm: '400px' } },
        }}
      />

      {/* Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ marginRight: 2 }} fontFamily={'Jaro'}>
          Name Surname
        </Typography>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </Box>
    </Box>
  );
};

export default Topbar;
