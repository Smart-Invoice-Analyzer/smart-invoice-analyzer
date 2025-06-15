import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api_url } from '../api/apiconfig';

// Önceki tipler
interface Vendor {
  name: string;
  address: string;
  country: string;
  phone: string;
  email: string;
}

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
  category: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  date: string;  // YYYY-MM-DD formatında tarih
  total_amount: number;
  currency: string;
  qr_data: string;
  vendor: Vendor;
  items: Item[];
  status: string | null;
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
    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#444' : '#e0e0e0' }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

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

        <div>
  {invoiceDetail ?  (
    <>
      {/* Vendor Info Section */}
      <Box sx={{ marginTop: "60px" }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {invoiceDetail.vendor.name}
        </Typography>
       
      </Box>

      {/* Invoice Summary Section */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Total Amount: {invoiceDetail.total_amount} {invoiceDetail.currency}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Status: {invoiceDetail.status || "Unknown"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Date: {invoiceDetail.date}</Typography>
        </Grid>
      </Grid>

      {/* Items Section */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 2 }}>Items:</Typography>
        <Grid container spacing={2}>
          {invoiceDetail.items.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="body2"><strong>Description:</strong> {item.description}</Typography>
                <Typography variant="body2"><strong>Quantity:</strong> {item.quantity}</Typography>
                <Typography variant="body2"><strong>Unit Price:</strong> {item.unit_price} {invoiceDetail.currency}</Typography>
                <Typography variant="body2"><strong>Category:</strong> {item.category}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  ) : (
    <Typography>No invoice found.</Typography>
  )}
</div>

        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default Invoice;
