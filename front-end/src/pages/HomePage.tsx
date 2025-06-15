import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add'

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const cardStyle = {
    backgroundColor: darkMode ? '#1e1e1e' : '#fff',
    color: darkMode ? '#fff' : '#000',
    boxShadow: 4,
    borderRadius: 3,
   
  };

  const infoCards = [
    {
      icon: <EmojiEventsIcon fontSize="large" color="warning" />,
      title: 'Invoice Upload Quota',
      content: 'Invoice uploaded: Today: 4, This week: 12, This month: 50\nDaily upload limit: 20 invoices.\nWhen the limit is reached, try again the next day.',
    },
    {
      icon: <InfoIcon fontSize="large" color="info" />,
      title: 'Tips & Tricks 🎯',
      content: 'Upload invoices via drag & drop. Don’t forget to check out the Reports tab for analytics!',
    },
    {
      icon: <AddIcon fontSize="large" color="info" />,
      title: 'Add New Invoice',
      content: 'Click the "+" icon in the bottom right to add a new invoice.',
    },
  ];

  return (
    <Box sx={{ display: 'flex',backgroundColor: darkMode ? '#444' : '#e0e0e0'}}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' },
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

        {/* HERO / GİRİŞ BÖLÜMÜ */}
{/* HERO / GİRİŞ BÖLÜMÜ */}

<Grid
  container
  spacing={4}
  alignItems="center"
  justifyContent="center"
  sx={{
    mt: 10,
    mb: 6,
    px: { xs: 2, sm: 6, md: 10 },
    py: 6,
    borderRadius: 4,
    background: darkMode
      ? 'linear-gradient(135deg, #1e1e1e 0%, #333 100%)'
      : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
    boxShadow: 3,
    ml: { xs: 0},
    width:"auto"
  }}
>
  <Grid item xs={12} md={6}>
    <Box sx={{ textAlign: { xs: 'center', md: 'left' }, pl: { md: 3 } }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: darkMode ? '#fff' : '#000' }}>
        Welcome back 👋
      </Typography>
      <Typography
        variant="h6"
        sx={{
          maxWidth: 500,
          color: darkMode ? '#ccc' : '#333',
          mt: 2,
        }}
      >
        Manage, analyze, and keep track of your invoices with ease. Start exploring now!
      </Typography>
    </Box>
  </Grid>

  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src="/data.svg"
        alt="Dashboard Illustration"
        style={{ maxHeight: 250, width: 'auto' }}
      />
    </Box>
  </Grid>
</Grid>



{/* BİLGİ KARTLARI */}
<Grid container spacing={3} sx={{ mb: 5 }}>
  {infoCards.map((card, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 + index * 0.2 }}
      >
        <Card sx={{ ...cardStyle, minHeight: 180 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'transparent' }}>{card.icon}</Avatar>
              <Typography variant="h6" sx={{ ml: 2 }}>
                {card.title}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {card.content}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default HomePage;
