// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Отправка запроса без Authorization заголовка
            const response = await API.post('/auth/login', {
                username,
                password
            });
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/tasks');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
        </div>
    );
};

export default LoginPage;
 