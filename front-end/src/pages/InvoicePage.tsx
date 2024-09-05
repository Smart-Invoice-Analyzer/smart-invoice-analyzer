import React, { useState } from 'react';
import { Box, Grid, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/sidebar'
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';

const Homepage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#444' : '#e0e0e0', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, backgroundColor: darkMode ? '#444' : '#e0e0e0', padding: 3, transition: 'margin-left 0.3s', marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' }, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        {/* Topbar */}
        <Topbar
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}
        />

        {/* Invoice List */}
        <Grid container spacing={3} sx={{ marginTop: 8 }}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  padding: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" fontFamily={'Jaro'}>Invoice Title</Typography>
                  <Typography variant="body2" color="textSecondary" fontFamily={'Jaro'}>
                    Description
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ marginRight: 2 }} fontFamily={'Jaro'}>
                    date
                  </Typography>
                  <IconButton>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Add New Button */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default Homepage;
