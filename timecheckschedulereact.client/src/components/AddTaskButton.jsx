// src/components/AddTaskButton.jsx
import React from 'react';

const AddTaskButton = ({ onClick }) => {
    return (
        <button onClick={onClick} style={{ marginBottom: '20px' }}>
            Add New Task
        </button>
    );
};

export default AddTaskButton;
