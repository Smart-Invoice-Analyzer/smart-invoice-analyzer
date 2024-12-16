// Topbar.tsx
import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { useDarkMode } from '../DarkMode/DarkModeContext';

interface TopbarProps {
  sidebarOpen: boolean;
  darkMode: boolean;
}


const Topbar: React.FC<TopbarProps> = ({ sidebarOpen}) => {

  const topbarname = useSelector ((state: RootState) => state.auth.username);
  const { darkMode, toggleDarkMode } = useDarkMode(); // Context'ten alındı
  
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
      height:"60px",
      
    }}>
    


      <Box></Box>
      <Box sx={{ display: 'flex', alignItems: 'center' , gap:"20px"}}>
        <CircleNotificationsRoundedIcon sx={{height:"36px",width:"36px",color: darkMode ? '#888' : '#000'}}></CircleNotificationsRoundedIcon>
        <Box sx={{display:"flex",alignItems:"center", gap:"10px"}}>
        <Avatar sx={{height:"30px",width:"30px",bgcolor:darkMode ? '#888' : '#000'}}>
          <PersonIcon sx={{color:darkMode ? " black" : "white"}} />
        </Avatar>
        <Typography variant="body1" sx={{ marginRight: 2,color: darkMode ? "white" : "black" }} fontFamily={'Jaro'}>
          {topbarname}
        </Typography>
       
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;




