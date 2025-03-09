import React, { useState, useEffect } from 'react';
import { Button, Modal, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface AddButtonProps {
  darkMode: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ darkMode }) => {
  const [scannerVisible, setScannerVisible] = useState(false);

  const userID = useSelector((state: RootState) => state.auth.userId);
  
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
    console.log('Taranan QR kod verisi:', qrCode);

    try {
      const parsedData = typeof qrCode === 'string' ? JSON.parse(qrCode) : qrCode;
      
      const formattedInvoice = {
        invoice_id: parsedData.invoice_code || "", 
        user_id: userID, 
        invoice_title: parsedData.gst_number || "", 
        date: parsedData.created || "", 
        amount: parsedData.total || null, 
        currency: parsedData.currency || "USD", 
        items: parsedData.line_items
          ? [
              {
                description: parsedData.hsn_code || "",
                quantity: parsedData.line_items || 0,
                price: parsedData.total || 0,
              },
            ]
          : [],
        status: parsedData.payment === "COD" ? "unpaid" : "paid",
      };

      console.log("Formatlanmış fatura:", formattedInvoice);

      const response = await axios.post("/invoicedata.json", formattedInvoice);
      console.log("Fatura başarıyla kaydedildi:", response.data);
    } catch (error) {
      console.error("QR kod işleme hatası:", error);
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
    </>
  );
};

export default AddButton;
