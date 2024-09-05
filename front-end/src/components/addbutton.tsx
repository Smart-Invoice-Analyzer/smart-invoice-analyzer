// AddButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  darkMode: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ darkMode }) => {
  return (
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
    >
      <AddIcon />
    </Button>
  );
};

export default AddButton;
