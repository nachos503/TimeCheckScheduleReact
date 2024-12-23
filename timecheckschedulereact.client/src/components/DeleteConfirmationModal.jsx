// src/components/DeleteConfirmationModal.jsx
import React from 'react';

const DeleteConfirmationModal = ({ task, onClose, onConfirm }) => {
    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete the task "<strong>{task.title}</strong>"?</p>
                <div style={{ marginTop: '20px' }}>
                    <button onClick={onConfirm} style={{ backgroundColor: 'red', color: '#fff' }}>Delete</button>
                    <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    }, 
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
};

export default DeleteConfirmationModal;
