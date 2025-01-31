import React, { useState, useEffect } from 'react';
import { Button, Modal, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Html5QrcodeScanner } from "html5-qrcode";

interface AddButtonProps {
  darkMode: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ darkMode }) => {
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    if (scannerVisible) {
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: 250,
        }, false);

        scanner.render(
          (decodedText) => {
            
            console.log(decodedText);
            
            setScannerVisible(false);
          },
          (errorMessage) => {
            
            console.error(errorMessage);
          }
        );
      }, 300); // scan dan once 300ms bekletmek lazim yoksa cakisiyor

      return () => clearTimeout(timer);
    }
  }, [scannerVisible]);

  return (
    <>
      <Button
        variant="contained"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: darkMode ? '#888' : '#01579b',
          ':hover': { backgroundColor: darkMode ? '#666' : '#0288d1' },
          borderRadius: '50%',
          padding: 2,
          minWidth: '50px',
          minHeight: '50px',
          zIndex: 1000
        }}
        onClick={() => setScannerVisible(true)} 
      >
        <AddIcon />
      </Button>

      
      <Modal open={scannerVisible} onClose={() => setScannerVisible(false)}>
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 2,
          boxShadow: 24,
          width: '50%',
          height: '60%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div id="reader" style={{ width: '50%', height: '100%',overflow:"auto" }}></div>
        </Box>
      </Modal>
    </>
  );
};

export default AddButton;
