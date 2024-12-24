import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await API.post('/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/home'; // Редирект после успешного входа
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка входа.');
        }
    };

    return (
        <>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Вход в Календарь TIMECHECK</title>
                <link href="./styles.css" rel="stylesheet" />
            </head>

            <body className="login-body">
                <div className="login-dialog">
                    <div className="logo">TIMECHECK</div>
                    <label htmlFor="login">Введите логин</label>
                    <input
                        type="text"
                        name="login"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="pass">Введите пароль</label>
                    <input
                        type="password"
                        name="pass"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Войти</button>
                    <p>
                        Нет аккаунта?{' '}
                        <Link to="/register" className="register-link">Зарегистрироваться</Link>
                    </p>
                </div>
            </body>
        </>
    );
};

export default LoginPage;
