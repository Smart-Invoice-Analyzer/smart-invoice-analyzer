import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const InvoiceList: React.FC = () => {
  // Geçici fatura listesi
  const invoices = [
    { id: 1, title: 'Invoice #12345', amount: 150.00 },
    { id: 2, title: 'Invoice #12346', amount: 200.00 },
    { id: 3, title: 'Invoice #12347', amount: 75.00 },
  ];

  return (
    <List>
      {invoices.map((invoice) => (
        <ListItem key={invoice.id}>
          <ListItemText 
            primary={invoice.title}
            secondary={`Amount: $${invoice.amount}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default InvoiceList;
