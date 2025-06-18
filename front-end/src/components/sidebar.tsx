import React from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography, Drawer, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import HelpIcon from '@mui/icons-material/Help';
import { useDarkMode } from '../DarkMode/DarkModeContext';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path: string) => () => {
    navigate(path);
    if (sidebarOpen) {
      toggleSidebar();
    }
  };

  const logoutAndRedirect = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate('/');
    }, 50);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: { xs: '250px', sm: '200px' },
        backgroundColor: darkMode ? '#555' : '#fff',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        cursor: 'pointer',
        pt: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 3,

          ml: "10px",

        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: darkMode ? '#fff' : '#333',
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <List sx={{ pr: sidebarOpen ? 5 : 4.5, cursor: 'pointer' }}>
        <ListItem
          onClick={handleNavigation('/home')}
          component='button'
          sx={{
            mb: 5,
            backgroundColor: 'transparent',
            ml: '18px',
            border: '0px',
            pl: sidebarOpen ? 0 : 0,

            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          <HomeIcon sx={{ mr: sidebarOpen ? 2 : 0, transition: 'transform 0.3s ease' }} />
          {sidebarOpen && <ListItemText primary="Home" />}
        </ListItem>
        <ListItem
          onClick={handleNavigation('/profile')}
          component='button'
          sx={{
            mb: 5,
            ml: '18px',
            backgroundColor: 'transparent',
            border: '0px',
            pl: sidebarOpen ? 0 : 0,

            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          <PersonIcon sx={{ mr: sidebarOpen ? 2 : 0 }} />
          {sidebarOpen && <ListItemText primary="Profile" />}
        </ListItem>
        <ListItem
          onClick={handleNavigation('/invoices')}
          component='button'
          sx={{
            mb: 5,
            ml: '18px',
            backgroundColor: 'transparent',
            border: '0px',
            pl: sidebarOpen ? 0 : 0,

            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          <ReceiptIcon sx={{ mr: sidebarOpen ? 2 : 0 }} />
          {sidebarOpen && <ListItemText primary="Invoices" />}
        </ListItem>
        <ListItem
          onClick={handleNavigation('/reports')}
          component='button'
          sx={{
            mb: 5,
            ml: '18px',
            backgroundColor: 'transparent',
            border: '0px',
            pl: sidebarOpen ? 0 : 0,

            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          <BarChartIcon sx={{ mr: sidebarOpen ? 2 : 0 }} />
          {sidebarOpen && <ListItemText primary="Expenses" />}
        </ListItem>
        <ListItem
          onClick={handleNavigation('/help')}
          component='button'
          sx={{
            mb: 1.5,
            ml: '18px',
            backgroundColor: 'transparent',
            border: '0px',
            pl: sidebarOpen ? 0 : 0,

            cursor: 'pointer',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          <HelpIcon sx={{ mr: sidebarOpen ? 2 : 0 }} />
          {sidebarOpen && <ListItemText primary="Support" />}
        </ListItem>
      </List>

      {/* Log Out Button */}
      <Box sx={{ position: 'absolute', width: '100%', bottom: 80, textAlign: sidebarOpen ? 'left' : 'center' }}>
        <Button
          variant="contained"
          startIcon={<ExitToAppIcon />}
          sx={{
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderRadius: '30px',
            width: sidebarOpen ? '120px' : '48px',
            minWidth: '48px',
            marginLeft: sidebarOpen ? '15px' : 'calc(50% - 24px)',
            backgroundColor: darkMode ? '#888' : '#01579b',
            color: '#fff',
            ':hover': { backgroundColor: darkMode ? '#666' : '#0288d1' },
            transition: 'margin-left 0.3s',
            paddingRight: sidebarOpen ? 1 : 0,
          }}
          onClick={logoutAndRedirect}
        >
          {sidebarOpen && 'Log Out'}
        </Button>
      </Box>

      {/* Dark Mode Toggle */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
          display: 'flex',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          paddingLeft: sidebarOpen ? '18px' : 0,
          boxSizing: 'border-box',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={toggleDarkMode}
          sx={{ cursor: 'pointer', color: darkMode ? '#fff' : '#333' }}
        >
          <IconButton sx={{ color: 'inherit' }}>
            <Brightness4Icon />
          </IconButton>
          {sidebarOpen && <Typography variant="body2">Dark Mode</Typography>}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: '250px',
            boxSizing: 'border-box',
            backgroundColor: darkMode ? '#555' : '#fff',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: sidebarOpen ? '200px' : '60px',
          backgroundColor: darkMode ? '#555' : '#fff',
          transition: 'width 0.3s',
          position: 'fixed',
          height: '100%',
          top: 0,
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1000,
          display: { xs: 'none', sm: 'block' },
          cursor: 'pointer',
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
};

export default Sidebar;