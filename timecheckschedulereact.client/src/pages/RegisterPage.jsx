import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await API.post('/auth/register', {
                username,
                password,
                email,
            });
            alert(response.data);
            navigate('/');
        } catch (error) {
            alert(error.response?.data || 'Ошибка регистрации');
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /> 
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default RegisterPage;
