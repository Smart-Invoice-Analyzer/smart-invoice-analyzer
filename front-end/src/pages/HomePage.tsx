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

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const cardStyle = {
    backgroundColor: darkMode ? '#1e1e1e' : '#fff',
    color: darkMode ? '#fff' : '#000',
    boxShadow: 4,
    borderRadius: 3,
    p: 3,
  };

  const infoCards = [
    {
      icon: <InsertChartIcon fontSize="large" color="primary" />,
      title: 'Invoice UpLoading Statistics',
      content: 'Today: 4, This week: 12, This month: 50',
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="warning" />,
      title: 'Invoice Upload Quota',
      content: 'Daily upload limit: 20 invoices.\nWhen the limit is reached, try again the next day.',
    },
    {
      icon: <InfoIcon fontSize="large" color="info" />,
      title: 'Add New Invoice',
      content: 'Click the "+" icon in the bottom right to add a new invoice.',
    },
  ];

  return (
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#121212' : '#f4f4f4' }}>
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

        {/* Arka Plan Videosu */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.07,
            zIndex: -1,
          }}
        >
          <source src="front-end/public/tqrcodeanimation-unscreen.gif" type="video/mp4" />
        </video>

        {/* Dashboard Giriş */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" sx={{ color: darkMode ? '#fff' : '#000', mb: 4 }}>
            Welcome to Smart Invoice Analyzer 👋
          </Typography>

          <Grid container spacing={3}>
            {infoCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 + index * 0.2 }}
                >
                  <Card sx={cardStyle}>
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

            {/* Kullanıcıya Özel Bilgi Kutusu */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: darkMode ? '#232323' : '#fff',
                    color: darkMode ? '#fff' : '#000',
                    padding: 4,
                    textAlign: 'center',
                    mt: 2,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    User Panel
                  </Typography>
                  <Typography variant="body1">
                   From here, you can track, analyze and perform historical reporting on the invoices you have uploaded to your system.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default HomePage;
