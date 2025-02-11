import React, { ReactNode, useState } from 'react';
import { Box, Grid, Button, IconButton, Typography, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
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

interface Invoice {
  status: 'paid' | 'unpaid';
  invoice_id: string;
  invoice_title: string;
  date: string;
  user_id: string;

}


const InvoicePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const navigate = useNavigate();

  const [invoiceId, setInvoiceId] = useState<string | undefined>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const toinvoice = () => {
    navigate(`/invoice/${invoiceId}`);
    console.log("hello world");
  }

  const userId = useSelector((state: RootState) => state.auth.userId);

  const [filters, setFilters] = useState({ Paid: false, Unpaid: false });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (userId) {
      setLoading(true);
      axios.get<Invoice[]>('/invoicedata.json')
        .then((response) => {
          setInvoices(response.data.filter(invoice => invoice.user_id === userId));
        })
        .catch((error) => {
          console.error("Error fetching invoice data:", error);
        });
    }
  }, [userId]);

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
    const matchesSearch = invoice.invoice_title.toLowerCase().includes(searchQuery.toLowerCase());
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

        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />
        <Box sx={{ display: "flex", gap: "10px", width: "100%" }} >
          <Box sx={{ marginTop: "65px", width: '100%', zIndex: "999", position: "fixed", display:"flex",alignItems:"center", gap:"10px" }}>
            <SearchBarr onSearch={handleSearch} /> 
            <Box>
            <FormGroup row>
  <FormControlLabel 
  control={<Checkbox 
    name="Paid"
                    checked={filters.Paid}
                    onChange={handleFilterChange}
   sx={{
    "&.Mui-checked": {
      color: "#01579b"
    },
  }}
  />} label="Paid" />
  <FormControlLabel 
  control={<Checkbox 
    name="Unpaid"
                    checked={filters.Unpaid}
                    onChange={handleFilterChange}
   sx={{
    "&.Mui-checked": {
      color: "#01579b"
    },
  }}
  />} label="Unpaid" />
  
</FormGroup></Box>
          </Box>
          


          <Grid container spacing={3} sx={{ marginTop: '120px', zIndex: "998" }}>

            {filteredInvoices.length> 0 ? (filteredInvoices.map((invoice) => (
              <Grid item xs={12} sm={6} key={invoice.invoice_id}>
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
                  <Box>
                    <Typography variant="h6" fontFamily={'Jaro'} color={darkMode ? "#F5F5F5" : "#212121"}>
                      {invoice.invoice_title}
                    </Typography>
                    <Typography variant="body2" color={darkMode ? '#BDBDBD' : "#757575"} fontFamily={'Jaro'} >
                      {invoice.status}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ marginRight: 2 }} fontFamily={'Jaro'} color={darkMode ? '#A5A5A5' : "#616161"}>
                      {invoice.date}
                    </Typography>
                    <IconButton
                      onClick={toinvoice}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))): (
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
                      ':hover': { opacity:"0.9" },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Invoice
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid> </Box>

        {/* Add New Button */}
        <AddButton darkMode={darkMode} userId={''} />
      </Box>
    </Box>
  );
};

export default InvoicePage;
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

