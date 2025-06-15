import React, { useState } from 'react';
import { Box, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { useNavigate } from 'react-router-dom';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const Help: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const colors = {
    light: {
      background: '#e0e0e0',
      text: '#000',
      card: '#fff',
      button: '#01579b',
      buttonText: '#fff'
    },
    dark: {
      background: '#444',
      text: '#e0e0e0',
      card: '#1e1e1e',
      button: '#888',
      buttonText: '#000'
    }
  };

  

  const theme = darkMode ? colors.dark : colors.light;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: theme.background,
          padding: 3,
          transition: 'margin-left 0.3s',
          marginTop: '60px',
          marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '0px' },
          height: '100vh',
          position: 'relative',
        }}
      >
        {/* Topbar */}
        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} toggleSidebar={toggleSidebar}/>

        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Support
          </Typography>

          {/* FAQ Section */}
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Accordion
              sx={{ backgroundColor: theme.card, color: theme.text }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.text }} />}>
                <Typography>How do I add a new invoice?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  To add a new invoice, click the "+" button located at the bottom right of the screen, then fill out the required details.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ backgroundColor: theme.card, color: theme.text }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.text }} />}>
                <Typography>How can I reset my password?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Go to the Profile page, and under Account Settings, you will find the option to reset your password.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ backgroundColor: theme.card, color: theme.text }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.text }} />}>
                <Typography>What file formats are supported?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Currently, we support PDF, PNG, and JPEG file formats for invoice uploads.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          

          {/* Feedback Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Give Feedback
            </Typography>
            <form>
              <TextField
                fullWidth
                label="Your Feedback"
                type="text"
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
                required
                InputProps={{ style: { color: theme.text } }}
                InputLabelProps={{ style: { color: theme.text } }}
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ backgroundColor: theme.button, color: theme.buttonText }}
              >
                Submit Feedback
              </Button>
            </form>
          </Box>
        </Box>

        {/* Add New Button */}
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default Help;
