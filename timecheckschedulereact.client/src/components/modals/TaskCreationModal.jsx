// src/components/Modals/TaskCreationModal.jsx

import React, { useState, useEffect } from 'react';

const TaskCreationModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const handleSave = () => {
        if (title.trim() === '') {
            alert('�������� ������ �� ����� ���� ������');
            return;
        }
        onSave({ title, description });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>������� ������</h3>
                <label htmlFor="task-title">�������� ������:</label>
                <input
                    type="text"
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="task-desc">�������� ������:</label>
                <textarea
                    id="task-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="row-buttons">
                    <button onClick={handleSave}>���������</button>
                    <button className="cancel" onClick={onClose}>������</button>
                </div>
            </div>
        </div>
    );
};

export default TaskCreationModal;
