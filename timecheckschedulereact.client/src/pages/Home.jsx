import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar/Calendar';
import ProjectModal from '../components/Modals/ProjectModal';
import TaskModal from '../components/Modals/TaskModal';
import TimerModal from '../components/Modals/TimerModal';
import AnalyticsModal from '../components/Modals/AnalyticsModal';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import profilePic from '../assets/profile-pic.jpg';

const Home = () => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [weeklyHours, setWeeklyHours] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchTasksForWeek();
    }, [currentWeek]);

    const fetchProjects = async () => {
        try {
            const response = await API.get('/projects');
            setProjects(response.data);
            if (response.data.length > 0) {
                setSelectedProject(response.data[0].id);
            }
        } catch (error) {
            console.error('Ошибка при получении проектов:', error);
            alert('Не удалось загрузить проекты.');
        }
    };

    const fetchTasksForWeek = async () => {
        try {
            const response = await API.get('/tasks', {
                params: {
                    startDate: currentWeek[0].toISOString(),
                    endDate: currentWeek[6].toISOString(),
                },
            });
            const tasksForWeek = response.data.map((task) => ({
                ...task,
                startTime: new Date(task.startTime),
                endTime: new Date(task.endTime),
            }));
            setTasks(tasksForWeek);

            // Рассчитываем часы для текущей недели
            const calculatedHours = tasksForWeek.reduce((total, task) => {
                const duration = (task.endTime - task.startTime) / (1000 * 60 * 60); // В часах
                return total + duration;
            }, 0);
            setWeeklyHours(calculatedHours.toFixed(2));
        } catch (error) {
            console.error('Ошибка при получении задач:', error);
            alert('Не удалось загрузить задачи.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddProject = (newProject) => {
        setProjects((prev) => [...prev, newProject]);
        if (!selectedProject) {
            setSelectedProject(newProject.id);
        }
    };

    const handleAddTask = () => {
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (task) => {
        try {
            await API.post('/tasks', task);
            alert('Задача успешно создана');
            setIsTaskModalOpen(false);
            fetchTasksForWeek();
        } catch (error) {
            console.error('Ошибка при сохранении задачи:', error);
            alert('Не удалось сохранить задачу.');
        }
    };

    const handleStartTimer = (time) => {
        alert(`Таймер запущен на ${time}`);
    };

    return (
        <div>
            <header>
                <div className="left-side">
                    <div className="logo">TIMECHECK</div>
                    <div className="left-menu">
                        <button onClick={() => setIsTimerModalOpen(true)}>Таймер</button>
                        <button onClick={() => setIsAnalyticsModalOpen(true)}>Аналитика</button>
                        <button onClick={() => setIsProjectModalOpen(true)}>Добавить проект</button>
                    </div>
                </div>
                <div className="right-side">
                    <input className="search" type="search" placeholder="Поиск" />
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            </header>

            <div className="cal-body">
                <div className="cal-header">
                    <div className="left-cal-header">
                        <div className="cal-name">
                            <img className="profile-pic" src={profilePic} alt="Profile" />
                            <div className="profile-name">Сафронов Евгений Сергеевич</div>
                        </div>
                        <div className="cal-total-hours">
                            Все часы: <span>{weeklyHours} / 40</span>
                        </div>
                    </div>
                    <div className="week-chooser">
                        <button className="prev-week" onClick={() => setCurrentWeek(getPreviousWeek(currentWeek))}>
                            &lt;
                        </button>
                        <div className="curr-week">
                            Неделя - {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
                        </div>
                        <button className="next-week" onClick={() => setCurrentWeek(getNextWeek(currentWeek))}>
                            &gt;
                        </button>
                    </div>
                    <button className="create-button" onClick={handleAddTask}>
                        Создать
                    </button>
                </div>

                <Calendar
                    currentWeek={currentWeek}
                    projects={projects}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                    tasks={tasks}
                />
            </div>

            {/* Модальные окна */}
            <ProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onProjectAdded={handleAddProject}
            />
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
            />
            <TimerModal
                isOpen={isTimerModalOpen}
                onClose={() => setIsTimerModalOpen(false)}
                onStart={handleStartTimer}
            />
            <AnalyticsModal
                isOpen={isAnalyticsModalOpen}
                onClose={() => setIsAnalyticsModalOpen(false)}
            />
        </div>
    );
};

// Вспомогательные функции
function getCurrentWeek() {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1; // Понедельник
    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push(new Date(now.setDate(first + i)));
    }
    return week;
}

function getPreviousWeek(currentWeek) {
    const prevWeek = currentWeek.map((date) => new Date(date));
    prevWeek.forEach((date) => date.setDate(date.getDate() - 7));
    return prevWeek;
}

function getNextWeek(currentWeek) {
    const nextWeek = currentWeek.map((date) => new Date(date));
    nextWeek.forEach((date) => date.setDate(date.getDate() + 7));
    return nextWeek;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
}

export default Home;
