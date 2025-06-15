import React, { useState, useEffect } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api_url } from '../api/apiconfig';
import { Vendor } from '../types';
import { Item } from '../types';


export interface Invoice {
  id: number;
  invoice_number: string;
  date: string;  // YYYY-MM-DD formatında tarih
  total_amount: number;
  currency: string;
  qr_data: string;
  vendor: Vendor;
  items: Item[];
  status: string | null;
  created_at: string | null;
}

interface InvoicesResponse {
  invoices: Invoice[];
}

const Invoice: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { invoiceId } = useParams(); 
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const formatDateTime = (rawDate: string | null) => {
  if (!rawDate) return "Tarih yok";

  const date = new Date(rawDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

  
  useEffect(() => {
    setLoading(true);
    axios.get<InvoicesResponse>(`${api_url}/invoices/get_invoices`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices);
          // invoiceId'ye göre ilgili faturayı buluyoruz
          const foundInvoice = response.data.invoices.find(invoice => invoice.id === parseInt(invoiceId!));
          setInvoiceDetail(foundInvoice || null); // Fatura bulunamazsa null atıyoruz
        } else {
          console.error("Received data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invoiceId, token]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <div>Loading...</div>
        </Box>;

  return (
  <Box sx={{ display: 'flex',backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
    <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' },
        transition: 'margin-left 0.3s ease-in-out',
      }}
    >
      <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <Typography variant="h6">Loading...</Typography>
        </Box>
      ) : invoiceDetail ? (
        <Box sx={{ marginTop: '70px' }}>
          {/* Invoice Summary + Vendor Info */}
<Grid container spacing={2} sx={{ marginBottom: 4 }}>
  {/* 🏢 Vendor Info */}
  <Grid item xs={12} sm={6} md={9}>
    <Box
  sx={{
    p: 3,
    borderRadius: 4,
    backgroundColor: darkMode ? '#2e2e2e' : '#fafafa',
    boxShadow: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5, // elemanlar arası boşluk
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 700,
      color: darkMode ? '#fff' : '#333',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}
  >
    🏢 {invoiceDetail.vendor.name}
  </Typography>

  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
    🌍 <strong>Country:</strong> {invoiceDetail.vendor.country?.toUpperCase()}
  </Typography>

  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
    📍 <strong>Address:</strong> {invoiceDetail.vendor.address}
  </Typography>

  <Divider sx={{ my: 1.5 }} />

  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    📞 {invoiceDetail.vendor.phone} | ✉️ {invoiceDetail.vendor.email}
  </Typography>
</Box>

  </Grid>

  {/* 💰 Total + 🗓️ Dates */}
  <Grid item xs={12} sm={6} md={3}>
    <Box
      sx={{
        padding: 2,
        backgroundColor: darkMode ? '#424242' : '#fff',
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
      }}
    >
      <Box sx={{display:"flex",justifyContent: 'space-between' }}>
      <Typography variant="h6">💰 Total</Typography>
      <Typography>{invoiceDetail.total_amount} {invoiceDetail.currency}</Typography>
</Box>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        🗓️ Date info
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
        <Typography variant="body2" color="text.secondary">Invoice Date:</Typography>
        <Typography variant="body2">{invoiceDetail.date}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">Added Date:</Typography>
        <Typography variant="body2">{formatDateTime(invoiceDetail.created_at)}</Typography>
      </Box>
    </Box>
  </Grid>
</Grid>


          {/* Items */}
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            🛒 Items:
          </Typography>
          <Grid container spacing={3}>
            {invoiceDetail.items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#424242' : '#fff',
                    boxShadow: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Typography variant="subtitle1"><strong>{item.description}</strong></Typography>
                  <Typography variant="body2">📦 Quantity: {item.quantity}</Typography>
                  <Typography variant="body2">💵 Unit Price: {item.unit_price} {invoiceDetail.currency}</Typography>
                  <Typography variant="body2">🏷️ Category: {item.category}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: '100px',
            textAlign: 'center',
            padding: 5,
            borderRadius: 3,
            backgroundColor: darkMode ? '#424242' : '#fff',
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>😕 Invoice Not Found</Typography>
          <Typography variant="body2">Please make sure the invoice ID is correct or try again later.</Typography>
        </Box>
      )}

      <AddButton darkMode={darkMode} />
    </Box>
  </Box>
);

};

export default Invoice;
