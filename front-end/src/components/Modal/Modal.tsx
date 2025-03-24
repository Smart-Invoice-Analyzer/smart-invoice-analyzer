// ModalComponent.tsx
import React from 'react';
import './Modal.css'; // Modal için CSS
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

interface ModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  userId:any;
}


const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose,userId }) => {
  const dispatch = useDispatch();

  const user_id = useSelector((state: any) => state.auth.user_id);
  console.log('user',user_id)
    const logoutt = () => {

      dispatch(logout());
      window.location.href = '/';
    }
  if (!isOpen) return null;

  
  const handleAccountDeletion = async () => {
    try {
      
      await axios.delete(`https://smart-invoice-analyzer-server.onrender.com/users/delete_user/${user_id}`);
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