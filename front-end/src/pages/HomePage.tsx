import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Paper, Divider, LinearProgress } from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { motion } from 'framer-motion'; // Animasyon için

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
          overflow: 'hidden',
        }}
      >
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

        {/* Background Video */}
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
            opacity: 0.1, // Arka planda daha az dikkat çeker
            zIndex: -1,
          }}
        >
          <source src="/qrcodeanimation-unscreen.gif" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        <Box sx={{ marginTop: '60px' }}>

           
       

          <Grid container spacing={3}>

          <Grid item xs={12} sm={12} md={8}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                      Fatura Yükleme Limiti
                    </Typography>
                    <Paper sx={{ backgroundColor: darkMode ? '#444' : '#f5f5f5', padding: 2, marginTop: 2 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black' }}>
                      Her kullanıcı, sistemimize günlük olarak en fazla 20 fatura yükleyebilir. Bu limit, işlemlerin düzgün ve verimli bir şekilde gerçekleşebilmesi için belirlenmiştir. Eğer günlük yükleme limitiniz dolarsa, bir sonraki gün yeniden fatura yüklemeye başlayabilirsiniz.
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

          <Grid item xs={12} sm={12} md={8}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                      Fatura Yükleme İstatistikleri
                    </Typography>
                    <Paper sx={{ backgroundColor: darkMode ? '#444' : '#f5f5f5', padding: 2, marginTop: 2 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black' }}>
                        <strong>Bugün</strong>: 4 Yükleme, <strong>Bu Hafta</strong>: 12 Yükleme, <strong>Bu Ay</strong>: 50 Yükleme
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
        
            {/* Kısa Süreli İstatistikler Kartları */}
            {/* <Grid item xs={12} sm={6} md={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ backgroundColor: darkMode ? '#555' : '#fff', boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'black' }}>
                      Bugünkü Yükleme Durumu
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                      <CircularProgress variant="determinate" value={10} size={50} sx={{ color: darkMode ? 'white' : 'black' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'black', marginLeft: 2 }}>
                        4 / 20 Yükleme Tamamlandı
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid> */}


            

            {/* Yükleme İstatistikleri */}
            

            {/* Yükleme Butonu */}
            <Grid item xs={12}>
              
                <Paper sx={{ backgroundColor: darkMode ? '#333' : '#white', padding: 17, textAlign: 'center',marginTop:"20px" }}>
                  <Box>
                  <Typography variant="h5" sx={{ color: darkMode ? 'white' : 'black' }}>
                    Yeni Fatura Yüklemek için sağ alt köşedeki artı butonuna tıklayın
                  </Typography>
                  <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 50,
          left: "65%",
         height:"70%",
         width:"33.5%",
          objectFit: 'cover',
          opacity: 1, // Videonun arka planda görünmesini sağlamak için
          
        }}
      >
        <source src="/qrcodeanimation.mp4" type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video></Box>
                </Paper>
              
            </Grid>
          </Grid>
        </Box>

        {/* Add Button with Hover Animation */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default HomePage;
