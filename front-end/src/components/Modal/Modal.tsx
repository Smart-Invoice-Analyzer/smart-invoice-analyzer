// ModalComponent.tsx
import React from 'react';
import './Modal.css'; // Modal için CSS
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

interface ModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  userId:any;
}


const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose,userId }) => {
  const dispatch = useDispatch();

    const logoutt = () => {

      dispatch(logout());
      window.location.href = '/';
    }
  if (!isOpen) return null;

  
  const handleAccountDeletion = async () => {
    try {
      
      await axios.delete(`http://localhost:5000/users/${userId}`);
      alert('Your account has been successfully deleted.');
      logoutt()
      
      
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
    onClose(true); // Close the modal after deletion
  };
  

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>Your account will be deleted, are you sure?</p>
        <button onClick={() => { handleAccountDeletion()}}>OK</button>
        <button onClick={() => onClose(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default ModalComponent;