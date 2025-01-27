import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress } from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';


const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />
<Box sx={{marginTop:"60px"}}>
              
        <Grid container spacing={3}>
          
          {/* Fatura Yükleme Durumu */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                  Fatura Yükleme Durumu
                </Typography>
                <LinearProgress variant="determinate" value={60} sx={{ marginTop: 2 }} />
                <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black', marginTop: 1 }}>
                  Yüklenen Faturalar: 30 / 50
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Fiyat Analiz Grafiği */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                  Fiyat Analizi
                </Typography>
                
              </CardContent>
            </Card>
          </Grid>

          {/* Son Yüklenen Faturalar */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                  Son Yüklenen Faturalar
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', marginTop: 2 }}>
                  {/* Faturaların listesi burada gösterilecek */}
                  <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black' }}>
                    Fatura 1 - 01/01/2025 - 1000 ₼
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black' }}>
                    Fatura 2 - 02/01/2025 - 1500 ₼
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Box>

        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default HomePage;
