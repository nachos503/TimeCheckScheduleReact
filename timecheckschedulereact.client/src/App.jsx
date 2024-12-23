import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './styles/styles.css'; // Корректный путь к стилям
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ErrorBoundary from './components/UI/ErrorBoundary';
import TimerModal from './components/Modals/TimerModal';
import Timer from './components/UI/Timer';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    // Состояние для работы с таймером
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false); // Открыто ли модальное окно таймера
    const [timerTime, setTimerTime] = useState(null); // Время таймера в формате "HH:MM"
    const [isTimerRunning, setIsTimerRunning] = useState(false); // Запущен ли таймер

    // Обработчик начала таймера
    const handleStartTimer = (time) => {
        setTimerTime(time); // Устанавливаем время, выбранное в TimerModal
        setIsTimerRunning(true); // Запускаем таймер
    };

    // Обработчик остановки таймера
    const handleStopTimer = (remainingSeconds) => {
        console.log(`Оставшееся время: ${remainingSeconds} секунд`);
        setIsTimerRunning(false); // Останавливаем таймер
    };

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />
                    <Route
                        path="/home"
                        element={
                            isAuthenticated ? (
                                <Home onOpenTimer={() => setIsTimerModalOpen(true)} /> // Передаём пропс для открытия таймера
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/calendar"
                        element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/analytics"
                        element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />}
                    />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
                </Routes>
            </Router>

            {/* Таймер, который отображается при запуске */}
            {isTimerRunning && timerTime && (
                <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
                    <Timer
                        initialTime={timerTime}
                        onStop={handleStopTimer} // Обработчик остановки таймера
                    />
                </div>
            )}

            {/* Модальное окно для установки времени таймера */}
            <TimerModal
                isOpen={isTimerModalOpen}
                onClose={() => setIsTimerModalOpen(false)}
                onStart={handleStartTimer} // Установка времени таймера
            />
        </ErrorBoundary>
    );
};

export default App;
