import React, { ReactNode, useState } from 'react';
import { Box, Grid, Button, IconButton, Typography, Checkbox, FormGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import SearchBarr from '../components/SearchBar';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link } from 'react-router-dom';
import { api_url } from '../api/apiconfig';
import { Invoice } from '../types';


interface InvoicesResponse {
  invoices: Invoice[];
}


const InvoicePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const navigate = useNavigate();

  const [invoiceIds, setInvoiceIds] = useState<number[]>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const toinvoice = () => {
    window.location.href = (`www.facebook.com`);
    console.log("hello world");
  }

  const username = useSelector((state: RootState) => state.auth.userName);

  const [filters, setFilters] = useState({ Paid: false, Unpaid: false });
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null); // Selected invoice ID for deletion
  const [openDialog, setOpenDialog] = useState(false);  // Dialog state


React.useEffect(() => {
  setLoading(true);
  axios.get<InvoicesResponse>(`${api_url}/invoices/get_invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (Array.isArray(response.data.invoices)) {
        setInvoices(response.data.invoices);
        setInvoiceIds(response.data.invoices.map(invoice => invoice.id));
      } else {
        console.error("Received data is not an array:", response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching invoice data:", error);
    })
    .finally(() => {
      setLoading(false); // HER DURUMDA LOADING DURUMU KAPATILIR
    });
}, [username]);


  const handleDeleteClick = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);  // Set selected invoice ID
    setOpenDialog(true);  // Open the confirmation dialog
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoiceId !== null) {
      axios.delete(`${api_url}/invoices/delete_invoice/${selectedInvoiceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("Invoice deleted:", response.data);
        setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== selectedInvoiceId));
        setOpenDialog(false);  // Close the dialog after successful deletion
        alert("Invoice successfully deleted!");  // Show success message
      })
      .catch(error => {
        console.error("Error deleting invoice:", error);
        setOpenDialog(false);  // Close the dialog if there is an error
        alert("Error deleting invoice.");
      });
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog without deletion
  };

  console.log(invoices, 'invoices');
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  // Filtrelenmiş faturalar
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      (!filters.Paid && !filters.Unpaid) || // Hiçbir checkbox seçili değilse hepsini göster
      (filters.Paid && invoice.status === 'paid') ||
      (filters.Unpaid && invoice.status === 'unpaid');
    return matchesSearch && matchesFilter;
  });


  return (

    <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#1E1E1E' : '#F5F5F5' }}>

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

        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} toggleSidebar={toggleSidebar} />
        <Box sx={{ display: "flex", gap: "10px", width: "100%" }} >
          <Box sx={{ marginTop: "65px", width: '100%', zIndex: "999", position: "fixed", display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchBarr onSearch={handleSearch} />
            <Box>
              <FormGroup row>
                
               

              </FormGroup></Box>
          </Box>



          <Grid container spacing={3} sx={{ marginTop: '120px', zIndex: "998" }}>

  {loading ? (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <div>Loading...</div>
      </Box>
    </Grid>
  ) : filteredInvoices.length > 0 ? (
    filteredInvoices.map((invoice) => (
      <Grid item xs={12} sm={6} key={invoice.id}>
        <Box
          sx={{
            backgroundColor: darkMode ? '#2C2C2C' : '#FFFFFF',
            borderRadius: '15px',
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <IconButton sx={{ padding: "0px" }} onClick={() => handleDeleteClick(invoice.id)}>
              <DeleteForeverIcon sx={{ marginTop: "0px", color: "#8a250f" }} />
            </IconButton>

            <Box sx={{ paddingLeft: "10px" }}>
              <Typography variant="h6" fontFamily={'Jaro'} color={darkMode ? "#F5F5F5" : "#212121"}>
                {invoice.vendor.name}
              </Typography>
              <Typography color={darkMode ? "#F5F5F5" : "#212121"}>{invoice.total_amount} {invoice.currency}</Typography>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} BackdropProps={{ style: { background: "none" } }} sx={{ backdrop: "none" }}>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete this invoice?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                <Button onClick={handleDeleteInvoice} color="secondary">Yes, Delete</Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ marginRight: 2 }} fontFamily={'Jaro'} color={darkMode ? '#A5A5A5' : "#616161"}>
              {invoice.date}
              <Typography variant="body1" color={darkMode ? '#BDBDBD' : "#757575"} fontFamily={'Roboto, sans-serif'}>
                {invoice.status}
              </Typography>
            </Typography>
            <IconButton onClick={() => navigate(`/invoices/invoice/${invoice.id}`)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    ))
  ) : (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          textAlign: 'center',
          backgroundColor: darkMode ? '#2C2C2C' : '#F0F0F0',
          borderRadius: '12px',
          padding: 4,
        }}
      >
        <AddIcon sx={{ fontSize: 64, color: darkMode ? '#F5F5F5' : '#9E9E9E', marginBottom: 2 }} />
        <Typography
          variant="h4"
          sx={{
            color: darkMode ? '#FFFFFF' : '#212121',
            fontWeight: 'bold',
            marginBottom: 2,
            fontFamily: 'Jaro',
          }}
        >
          No invoices added
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: darkMode ? '#BDBDBD' : '#616161',
            fontFamily: 'Jaro',
            marginBottom: 3,
          }}
        >
          You don’t have any invoices yet. Start creating one now!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-invoice')}
          sx={{
            backgroundColor: darkMode ? '#888' : '#01579b',
            color: '#FFFFFF',
            ':hover': { opacity: "0.9" },
          }}
          startIcon={<AddIcon />}
        >
          Add Invoice
        </Button>
      </Box>
    </Grid>
  )}
</Grid>
 </Box>

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

