// src/components/Modals/ProjectModal.jsx
import React, { useState } from 'react';
import API from '../../services/api';

const ProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
    const [projectName, setProjectName] = useState('');

    const handleAdd = async () => {
        if (projectName.trim() === '') {
            alert('Название проекта не может быть пустым');
            return;
        }

        try {
            const response = await API.post('/projects', { name: projectName });
            setProjectName('');
            onProjectAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении проекта:', error);
            alert('Не удалось добавить проект.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <h3>Добавить проект</h3>
            <label htmlFor="project-add">Введите название проекта</label>
            <input
                type="text"
                name="project-add"
                id="project-add"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Название проекта"
            />
            <div className="row-buttons">
                <button onClick={handleAdd}>Добавить проект</button>
                <button className="cancel" onClick={onClose}>
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default ProjectModal;
