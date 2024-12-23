// src/services/api.js
import axios from 'axios';

// Создание экземпляра Axios с базовым URL на бэкенд
const API = axios.create({
    baseURL: 'https://localhost:7070/api', // Замените на ваш URL бэкенда
});

// Добавление перехватчика запросов для автоматического добавления токена
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.url.endsWith('/auth/login') && !config.url.endsWith('/auth/register')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
