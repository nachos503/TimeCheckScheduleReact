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
            alert('Название задачи не может быть пустым');
            return;
        }
        onSave({ title, description });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Создать задачу</h3>
                <label htmlFor="task-title">Название задачи:</label>
                <input
                    type="text"
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="task-desc">Описание задачи:</label>
                <textarea
                    id="task-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="row-buttons">
                    <button onClick={handleSave}>Сохранить</button>
                    <button className="cancel" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default TaskCreationModal;
