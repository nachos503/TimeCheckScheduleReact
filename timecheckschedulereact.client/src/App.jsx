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

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Проверка авторизации
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false); // Открыто ли модальное окно таймера
    const [timerTime, setTimerTime] = useState(null); // Время таймера в формате "HH:MM"
    const [isTimerRunning, setIsTimerRunning] = useState(false); // Запущен ли таймер

    const handleStartTimer = (time) => {
        setTimerTime(time); // Устанавливаем время, выбранное в TimerModal
        setIsTimerRunning(true); // Запускаем таймер
    };

    const handleStopTimer = (remainingSeconds) => {
        console.log(`Оставшееся время: ${remainingSeconds} секунд`);
        setIsTimerRunning(false); // Останавливаем таймер
    };

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Защищённые маршруты */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home onOpenTimer={() => setIsTimerModalOpen(true)} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <CalendarPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <AnalyticsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>

            {/* Таймер */}
            {isTimerRunning && timerTime && (
                <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
                    <Timer
                        initialTime={timerTime}
                        onStop={handleStopTimer} // Обработчик остановки таймера
                    />
                </div>
            )}

            {/* Модальное окно таймера */}
            <TimerModal
                isOpen={isTimerModalOpen}
                onClose={() => setIsTimerModalOpen(false)}
                onStart={handleStartTimer} // Установка времени таймера
            />
        </ErrorBoundary>
    );
};

export default App;
