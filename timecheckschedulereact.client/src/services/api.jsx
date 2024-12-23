// src/services/api.js
import axios from 'axios';

// �������� ���������� Axios � ������� URL �� ������
const API = axios.create({
    baseURL: 'https://localhost:7070/api', // URL ������ �������
    // withCredentials: true, // ��������, ���� ���������� ���������� ����
});

// ���������� ������������ �������� ��� ��������������� ���������� ������
API.interceptors.request.use(
    (config) => {
        // �� ��������� Authorization ��� ���������� ����������� � �����
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
