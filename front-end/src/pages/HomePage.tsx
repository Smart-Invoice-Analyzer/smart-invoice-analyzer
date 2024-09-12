import React, { useState } from 'react';
import { Box, Grid, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { boolean } from 'yup';

const HomePage: React.FC = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

 

  return (
    // Dıştaki kapsayıcıdan 'height: 100vh' ve 'overflow: hidden' kaldırıldı
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main content */}
      {/* Burada 'height: 100vh' ve 'overflowY: auto' kaldırıldı */}
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


        {/* Add New Button */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default HomePage;
