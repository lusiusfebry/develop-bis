import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Request interceptor: tambahkan token ke header Authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bis_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('bis_token');
            localStorage.removeItem('bis_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
