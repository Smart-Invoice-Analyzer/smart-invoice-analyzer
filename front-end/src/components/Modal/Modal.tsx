// ModalComponent.tsx
import React from 'react';
import './Modal.css'; // Modal için CSS

interface ModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>Emin misiniz?</p>
        <button onClick={() => onClose(true)}>OK</button>
        <button onClick={() => onClose(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default ModalComponent;
