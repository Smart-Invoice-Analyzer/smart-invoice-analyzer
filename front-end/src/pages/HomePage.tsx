import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add'
import { Invoice } from '../types';
import axios from 'axios';
import { api_url } from '../api/apiconfig';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';



interface InvoicesResponse {
  added_today: number;
  invoices: Invoice[];
}
const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceIds, setInvoiceIds] = useState<number[]>();
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.userName);
  const [addedToday, setAddedToday] = useState<number>(0);
  const [addedThisWeek, setAddedThisWeek] = useState(0);
  const [addedThisMonth, setAddedThisMonth] = useState(0);


  React.useEffect(() => {
    setLoading(true);
    axios.get<InvoicesResponse>(`${api_url}/invoices/get_invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const data = response.data;

        if (Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
          setInvoiceIds(data.invoices.map(invoice => invoice.id));
          setAddedToday(data.added_today);

          const now = new Date();
          const startOf7DaysAgo = new Date();
          startOf7DaysAgo.setDate(now.getDate() - 6); // bugün dahil son 7 gün

          const startOf30DaysAgo = new Date();
          startOf30DaysAgo.setDate(now.getDate() - 29); // bugün dahil son 30 gün

          let weekCount = 0;
          let monthCount = 0;

          data.invoices.forEach(invoice => {
            if (invoice.created_at) {
              const createdDate = new Date(invoice.created_at);
              if (createdDate >= startOf7DaysAgo) weekCount++;
              if (createdDate >= startOf30DaysAgo) monthCount++;
            }
          });

          setAddedThisWeek(weekCount);
          setAddedThisMonth(monthCount);
        } else {
          console.error("Received data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      })
      .finally(() => {
        setLoading(false); // HER DURUMDA LOADING DURUMU KAPATILIR
      });
  }, [username]);

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
      title: 'Invoice Uploaded',
      content: `Today: ${addedToday}\n This week: ${addedThisWeek}\n This month: ${addedThisMonth}`,
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
    <Box sx={{ display: 'flex' }}>
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
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} toggleSidebar={toggleSidebar} />

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
            ml: { xs: 0 },
            width: "auto"
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
