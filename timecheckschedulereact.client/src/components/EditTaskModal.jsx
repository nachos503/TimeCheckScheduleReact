// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const EditTaskModal = ({ task, onClose, onSave }) => {
    const isEditMode = !!task;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (isEditMode && task) {
            setTitle(task.title);
            setDescription(task.description);
            setStartTime(task.startTime.slice(0, 16)); // Форматирование для input типа datetime-local
            setEndTime(task.endTime.slice(0, 16));
            setDate(task.date.slice(0, 10)); // Форматирование для input типа date
        }
    }, [isEditMode, task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            date: new Date(date).toISOString(),
            // Если редактирование, добавляем id
            ...(isEditMode && { id: task.id })
        };

        await onSave(taskData);
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Start Time:</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>End Time:</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <button type="submit">{isEditMode ? 'Save Changes' : 'Create Task'}</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
                    </div>
                </form>
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
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
};

export default EditTaskModal;
