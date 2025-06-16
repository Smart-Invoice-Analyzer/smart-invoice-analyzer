import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import MenuIcon from '@mui/icons-material/Menu';

interface TopbarProps {
  sidebarOpen: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
}


const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, toggleSidebar }) => {

  const topbarname = useSelector((state: RootState) => state.auth.username);
  const { darkMode, toggleDarkMode } = useDarkMode(); // Context'ten alındı

  const [openNotif, setOpenNotif] = useState(false);
  const anchorRef = useRef(null);

  const handleToggleNotif = () => {
    setOpenNotif((prev) => !prev);
  };

  const handleClose = () => {
    setOpenNotif(false);
  };


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
      height: "60px",

    }}>



      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon sx={{ color: darkMode ? '#fff' : '#000' }} />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px" }}>
        <IconButton onClick={handleToggleNotif} ref={anchorRef}>  <CircleNotificationsRoundedIcon sx={{ height: "36px", width: "36px", color: darkMode ? '#888' : '#000' }}></CircleNotificationsRoundedIcon></IconButton>


        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar sx={{ height: "30px", width: "30px", bgcolor: darkMode ? '#888' : '#000' }}>
            <PersonIcon sx={{ color: darkMode ? " black" : "white" }} />
          </Avatar>
          <Typography variant="body1" sx={{ marginRight: 2, color: darkMode ? "white" : "black" }} fontFamily={'Jaro'}>
            {topbarname}
          </Typography>

        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;




