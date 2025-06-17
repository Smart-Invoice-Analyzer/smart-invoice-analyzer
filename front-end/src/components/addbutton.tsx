import React, { useState, useEffect } from 'react';
import { Button, Modal, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api_url } from '../api/apiconfig';
import { CircularProgress } from '@mui/material';


interface AddButtonProps {
  darkMode: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ darkMode }) => {
  const [scannerVisible, setScannerVisible] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');



  useEffect(() => {
    if (scannerVisible) {
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: 250,
        }, false);

        scanner.render(
          (decodedText) => {
            handleQRCodeScan(decodedText);
            scanner.clear();
            setScannerVisible(false);
          },
          (errorMessage) => {
            console.error(errorMessage);
          }
        );
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [scannerVisible]);



  const handleQRCodeScan = async (qrCode: string) => {
    setStatus('loading');
    try {
      const formattedData = {
        qr_data: qrCode
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Correctly formatted token
        }
      };

      const response = await axios.post(
        `${api_url}/invoices/process_qr`,
        formattedData, config
      );

      setStatus('success');
      setNotification("Invoice Added Succesfully.");
      setNotificationType("success");

       setTimeout(() => {
      setStatus('idle');
      setScannerVisible(false);
    }, 1500);
    } catch (error) {
      console.error("QR code error:", error);
      setStatus('error');
      setNotification("An error occured while invoice adding");
      setNotificationType("error");

      setTimeout(() => {
      setStatus('idle');
      setScannerVisible(false);
    }, 1500);
    }
  };


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
          <div id="reader" style={{ width: '50%', height: '100%', overflow: "auto" }}></div>
        </Box>
      </Modal>
      {status !== 'idle' && (
  <Box sx={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1300,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  }}>
    {status === 'loading' && <CircularProgress />}

    {status === 'success' && (
      <>
        <Box sx={{ fontSize: 48, color: 'green' }}>✔</Box>
        <Box sx={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>
          Invoice Added Succesfully
        </Box>
      </>
    )}

    {status === 'error' && (
      <>
        <Box sx={{ fontSize: 48, color: 'red' }}>✖</Box>
        <Box sx={{ fontWeight: 'bold', fontSize: 16, color: 'red' }}>
          An error occurred
        </Box>
      </>
    )}
  </Box>
)}


    </>
  );
};

export default AddButton;
