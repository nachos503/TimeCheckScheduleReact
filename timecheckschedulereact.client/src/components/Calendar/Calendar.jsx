// src/components/Calendar/Calendar.jsx
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import EventBlock from './EventBlock';
import TaskModal from '../Modals/TaskModal';

const Calendar = ({ currentWeek, projects, selectedProject, setSelectedProject }) => {
    const [tasks, setTasks] = useState([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskModalData, setTaskModalData] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [currentWeek]);

    const fetchTasks = async () => {
        try {
            const response = await API.get('/tasks');
            const fetchedTasks = response.data.map((task) => ({
                ...task,
                startTime: new Date(task.startTime),
                endTime: new Date(task.endTime),
            }));
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Ошибка при получении задач:', error);
            alert('Не удалось загрузить задачи.');
        }
    };

    const handleMouseDown = (day, time) => {
        setSelectedTimeRange({ day, startTime: time, endTime: time });
    };

    const handleMouseOver = (day, time) => {
        if (selectedTimeRange && day.toISOString() === selectedTimeRange.day.toISOString()) {
            setSelectedTimeRange((prev) => ({ ...prev, endTime: time }));
        }
    };

    const handleMouseUp = () => {
        if (selectedTimeRange) {
            const { day, startTime, endTime } = selectedTimeRange;

            const startDate = new Date(startTime);
            const endDate = new Date(endTime);

            if (endDate < startDate) {
                setSelectedTimeRange({ ...selectedTimeRange, endTime: startTime });
                return;
            }

            setTaskModalData({
                date: day.toISOString().split('T')[0],
                startTime: formatTime(startDate),
                endTime: formatTime(endDate),
            });

            setIsTaskModalOpen(true);
        }
    };

    const handleTaskClick = (task) => {
        setTaskModalData({
            ...task,
            startTime: task.startTime.toISOString().split('T')[1].slice(0, 5),
            endTime: task.endTime.toISOString().split('T')[1].slice(0, 5),
        });
        setIsTaskModalOpen(true);
    };

    const handleTaskModalClose = () => {
        setIsTaskModalOpen(false);
        setSelectedTimeRange(null);
        setTaskModalData(null);
    };

    const handleTaskSave = async (taskData) => {
        try {
            if (taskModalData?.id) {
                await API.put(`/tasks/${taskModalData.id}`, taskData);
                alert('Задача успешно обновлена');
            } else {
                await API.post('/tasks', taskData);
                alert('Задача успешно создана');
            }
            setIsTaskModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Ошибка при сохранении задачи:', error);
            alert('Не удалось сохранить задачу.');
        }
    };

    const handleTaskDelete = async () => {
        try {
            if (taskModalData?.id) {
                await API.delete(`/tasks/${taskModalData.id}`);
                alert('Задача успешно удалена');
                setIsTaskModalOpen(false);
                fetchTasks();
            }
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
            alert('Не удалось удалить задачу.');
        }
    };

    const eventsByDay = currentWeek.reduce((acc, day) => {
        const dayString = day.toISOString().split('T')[0];
        acc[dayString] = tasks.filter((task) => task.date === dayString);
        return acc;
    }, {});

    return (
        <div className="cal-main" onMouseUp={handleMouseUp}>
            <div className="time-column">
                <div className="time-header">Время</div>
                {[...Array(32)].map((_, idx) => {
                    const hour = Math.floor(idx / 4) + 8;
                    const minutes = (idx % 4) * 15;
                    return (
                        <div className="time-slot" key={idx}>
                            {hour}:{minutes === 0 ? '00' : minutes.toString().padStart(2, '0')}
                        </div>
                    );
                })}
            </div>
            <div className="cal-grid">
                {currentWeek.map((day) => (
                    <div className="day-column" key={day.toISOString()}>
                        <div className="date-header">
                            {day.toLocaleDateString('ru-RU', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </div>
                        <div
                            className="event-space"
                            onMouseDown={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const y = e.clientY - rect.top;
                                const idx = Math.floor(y / 35);
                                const time = new Date(day);
                                time.setHours(8 + Math.floor(idx / 4), (idx % 4) * 15, 0, 0);
                                handleMouseDown(day, time.toISOString());
                            }}
                            onMouseOver={(e) => {
                                if (selectedTimeRange) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const y = e.clientY - rect.top;
                                    const idx = Math.floor(y / 35);
                                    const time = new Date(selectedTimeRange.day);
                                    time.setHours(8 + Math.floor(idx / 4), (idx % 4) * 15, 0, 0);
                                    handleMouseOver(selectedTimeRange.day, time.toISOString());
                                }
                            }}
                        >
                            {eventsByDay[day.toISOString().split('T')[0]]?.map((task) => (
                                <EventBlock key={task.id} event={task} onClick={() => handleTaskClick(task)} />
                            ))}
                            {selectedTimeRange && selectedTimeRange.day.toISOString() === day.toISOString() && (
                                <div
                                    className="selection"
                                    style={{
                                        position: 'absolute',
                                        top: `${calculateTop(selectedTimeRange.startTime)}px`,
                                        height: `${calculateHeight(selectedTimeRange.startTime, selectedTimeRange.endTime)}px`,
                                        width: '100%',
                                        backgroundColor: 'rgba(153, 153, 255, 0.3)',
                                        pointerEvents: 'none',
                                    }}
                                ></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleTaskModalClose}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                initialTaskData={taskModalData}
            />
        </div>
    );
};

function calculateTop(startTime) {
    const date = new Date(startTime);
    const totalMinutes = (date.getHours() - 8) * 60 + date.getMinutes();
    return (totalMinutes / 15) * 35;
}

function calculateHeight(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const totalMinutes = (endDate - startDate) / 60000;
    return (totalMinutes / 15) * 35;
}

Date.prototype.getWeekNumber = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};



function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export default Calendar;
