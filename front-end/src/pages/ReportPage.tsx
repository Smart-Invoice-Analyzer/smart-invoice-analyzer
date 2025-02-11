import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/sidebar'
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';


const ReportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#444' : '#e0e0e0', overflow: 'hidden' }}>
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        
        toggleSidebar={toggleSidebar}
     
      />

      <Box sx={{ flexGrow: 1, backgroundColor: darkMode ? '#444' : '#e0e0e0', padding: 3, transition: 'margin-left 0.3s', marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' }, height: '100vh', overflowY: 'auto', position: 'relative' }}>

        <Topbar
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}    />

        <AddButton darkMode={darkMode} userId={''} />
      </Box>
    </Box>
  );
};

export default ReportPage;
