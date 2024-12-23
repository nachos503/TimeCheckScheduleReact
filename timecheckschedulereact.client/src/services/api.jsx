// src/services/api.js
import axios from 'axios';

// Создание экземпляра Axios с базовым URL на бэкенд
const API = axios.create({
    baseURL: 'https://localhost:7070/api', // URL вашего бэкенда
    // withCredentials: true, // Добавьте, если необходимо отправлять куки
});

// Добавление перехватчика запросов для автоматического добавления токена
API.interceptors.request.use(
    (config) => {
        // Не добавлять Authorization для эндпоинтов регистрации и входа
        if (!config.url.endsWith('/auth/login') && !config.url.endsWith('/auth/register')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Authorization header set:', config.headers.Authorization);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
