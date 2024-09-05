import React, { useState } from 'react';
import { Box, Grid, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/sidebar'
import Topbar from '../components/topbar';
import { useNavigate } from 'react-router-dom';
import AddButton from '../components/addbutton';


const Homepage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navigate = useNavigate();


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

       
        {/* Add New Button */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default Homepage;
