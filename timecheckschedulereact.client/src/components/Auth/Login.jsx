// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            alert('Пожалуйста, введите имя пользователя и пароль');
            return;
        }

        try {
            const response = await API.post('/auth/login', { username, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/home');
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className="auth-container">
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <div className="auth-field">
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Введите имя пользователя"
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default Login;