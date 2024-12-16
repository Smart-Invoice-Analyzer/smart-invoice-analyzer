import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Routes from './routes';
import { BrowserRouter

 } from 'react-router-dom';
 import store from './store/store';
 import { Provider } from 'react-redux';
import { useDarkMode } from './DarkMode/DarkModeContext';
import { CssBaseline } from '@mui/material';

const theme = createTheme();


function App() {

  const { darkMode } = useDarkMode();

  const theme = createTheme({
    palette: {
     
      background: {
        default: darkMode ? '#444' : '#e0e0e0', // Arka plan rengi
      },
    },
    
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
            <Routes /></ThemeProvider>
    
  );
}

export default App;
