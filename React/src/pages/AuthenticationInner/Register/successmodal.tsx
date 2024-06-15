// SuccessModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessModalProps {
  show: boolean;
  onHide: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onHide, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center">
        <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
        <p className="mt-3">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
