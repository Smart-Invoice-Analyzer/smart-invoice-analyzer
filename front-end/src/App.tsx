import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Routes from './routes';
import { BrowserRouter

 } from 'react-router-dom';
 import store from './store/store';
 import { Provider } from 'react-redux';

const theme = createTheme();


function App() {
  return (
    
            <Routes />
    
  );
}

export default App;
