// src/pages/TasksPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import EditTaskModal from '../components/EditTaskModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AddTaskButton from '../components/AddTaskButton';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await API.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to fetch tasks.');
        }
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await API.delete(`/tasks/${selectedTask.id}`);
            setTasks(tasks.filter(task => task.id !== selectedTask.id));
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
            alert('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to delete task.');
        }
    };

    const handleEditSave = async (updatedTask) => {
        if (selectedTask) {
            // Режим редактирования
            try {
                const response = await API.put(`/tasks/${updatedTask.id}`, updatedTask);
                setTasks(tasks.map(task => (task.id === updatedTask.id ? response.data : task)));
                setIsEditModalOpen(false);
                setSelectedTask(null);
                alert('Task updated successfully.');
            } catch (error) {
                console.error('Error updating task:', error.response?.data || error.message);
                alert(error.response?.data?.message || 'Failed to update task.');
            }
        } else {
            // Режим создания
            try {
                const response = await API.post('/tasks', updatedTask);
                setTasks([...tasks, response.data]);
                setIsEditModalOpen(false);
                alert('Task created successfully.');
            } catch (error) {
                console.error('Error creating task:', error.response?.data || error.message);
                alert(error.response?.data?.message || 'Failed to create task.');
            }
        }
    };

    return (
        <div>
            <h1>Your Tasks</h1>
            <AddTaskButton onClick={() => setIsEditModalOpen(true)} />
            <ul>
                {tasks.map(task => (
                    <li key={task.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Start: {new Date(task.startTime).toLocaleString()}</p>
                        <p>End: {new Date(task.endTime).toLocaleString()}</p>
                        <p>Date: {new Date(task.date).toLocaleDateString()}</p>
                        <button onClick={() => handleEditClick(task)}>Edit</button>
                        <button onClick={() => handleDeleteClick(task)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Модальное окно для редактирования/создания задачи */}
            {isEditModalOpen && (
                <EditTaskModal
                    task={selectedTask}
                    onClose={() => { setIsEditModalOpen(false); setSelectedTask(null); }}
                    onSave={handleEditSave}
                />
            )}

            {/* Модальное окно подтверждения удаления */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    task={selectedTask}
                    onClose={() => { setIsDeleteModalOpen(false); setSelectedTask(null); }}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default TasksPage;
