// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './styles/styles.css'; // Корректный путь к стилям
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ErrorBoundary from './components/UI/ErrorBoundary';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />
                    <Route
                        path="/home"
                        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
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
        </ErrorBoundary>
    );
};

export default App;




