// src/components/Modals/TaskModal.jsx
import React, { useState, useEffect } from 'react';

const TaskModal = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    projects,
    selectedProject,
    setSelectedProject,
    initialTaskData,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (initialTaskData) {
            setTitle(initialTaskData.title || '');
            setDescription(initialTaskData.description || '');
            setStartTime(initialTaskData.startTime || '');
            setEndTime(initialTaskData.endTime || '');
            setDate(initialTaskData.date || '');
            setSelectedProject(initialTaskData.projectId || '');
        } else {
            setTitle('');
            setDescription('');
            setStartTime('');
            setEndTime('');
            setDate('');
            setSelectedProject('');
        }
    }, [initialTaskData, setSelectedProject]);

    const handleSave = () => {
        if (title.trim() === '' || !selectedProject) {
            alert('Название задачи и проект обязательны');
            return;
        }

        if (startTime >= endTime) {
            alert('Время окончания должно быть позже времени начала');
            return;
        }

        // Форматирование времени в ISO 8601
        const formattedStartTime = `${date}T${startTime}:00`;
        const formattedEndTime = `${date}T${endTime}:00`;

        const taskData = {
            title,
            description,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            projectId: selectedProject,
        };

        onSave(taskData);
    };

    const handleDelete = () => {
        if (onDelete) {
            if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
                onDelete();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal task-create">
            <h3>{initialTaskData ? 'Редактировать задачу' : 'Создать задачу'}</h3>
            <div className="row">
                <div className="task-field">
                    <label htmlFor="task-name">Название задачи</label>
                    <input
                        type="text"
                        name="task-name"
                        id="task-name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите название задачи"
                    />
                </div>
                <div className="task-field">
                    <label htmlFor="task-project">Выберите проект</label>
                    <select
                        name="task-project"
                        id="task-project"
                        value={selectedProject || ''}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="" disabled>
                            -- Выберите проект --
                        </option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="task-field start-time">
                    <label htmlFor="task-start-time">Время начала</label>
                    <input
                        type="time"
                        name="task-start-time"
                        id="task-start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="task-field end-time">
                    <label htmlFor="task-end-time">Время окончания</label>
                    <input
                        type="time"
                        name="task-end-time"
                        id="task-end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="row date-time">
                <div className="task-field">
                    <label htmlFor="task-date">Дата выполнения</label>
                    <input
                        type="date"
                        name="task-date"
                        id="task-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="row task-description">
                <div className="task-field">
                    <label htmlFor="task-desc">Описание задачи</label>
                    <textarea
                        name="task-desc"
                        id="task-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание задачи"
                    ></textarea>
                </div>
            </div>
            <div className="row-buttons">
                <button onClick={handleSave}>{initialTaskData ? 'Сохранить изменения' : 'Сохранить'}</button>
                {initialTaskData && (
                    <button className="delete" onClick={handleDelete}>
                        Удалить
                    </button>
                )}
                <button className="cancel" onClick={onClose}>
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default TaskModal;
