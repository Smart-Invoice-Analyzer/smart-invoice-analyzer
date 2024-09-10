import React, { ReactNode, useState } from 'react';
import { Box, Grid, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';


  interface Invoice {
    status: ReactNode;
    invoice_id: string;
    invoice_title: string;
    date: string;
    user_id: string;
   
  }


const InvoicePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navigate = useNavigate();
  
  const [invoiceId, setInvoiceId] = useState<string | undefined>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const toinvoice = () => {
    navigate(`/invoices/${invoiceId}`);
    console.log("hello world");  
  }

  const userId = useSelector ((state:RootState) => state.auth.userId);
  
  
  React.useEffect(() => {
    // Axios ile JSON dosyasını çekiyoruz
    axios.get<Invoice[]>('/invoicedata.json')
      .then((response) => {
        setInvoices(response.data.filter(invoice => invoice.user_id === userId));
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, []);

  
  
    return (
    // Dıştaki kapsayıcıdan 'height: 100vh' ve 'overflow: hidden' kaldırıldı
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main content */}
      {/* Burada 'height: 100vh' ve 'overflowY: auto' kaldırıldı */}
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
        {/* Topbar */}
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

        {/* Invoice List */}
        {/* 'marginTop: 8' yerine 'marginTop' değerini ayarladık */}
        <Grid container spacing={3} sx={{ marginTop: '100px' }}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} key={invoice.invoice_id}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  padding: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" fontFamily={'Jaro'}>
                    {invoice.invoice_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" fontFamily={'Jaro'}>
                    {invoice.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ marginRight: 2 }} fontFamily={'Jaro'}>
                    {invoice.date}
                  </Typography>
                  <IconButton
                    onClick={toinvoice}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Add New Button */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default InvoicePage;
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

