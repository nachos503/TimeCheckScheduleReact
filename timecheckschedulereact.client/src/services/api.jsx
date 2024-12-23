// src/services/api.js
import axios from 'axios';

// �������� ���������� Axios � ������� URL �� ������
const API = axios.create({
    baseURL: 'https://localhost:7070/api', // �������� �� ��� URL �������
});

// ���������� ������������ �������� ��� ��������������� ���������� ������
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
