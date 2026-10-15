import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('quantix_token');
        if (token && !config.url?.startsWith('/auth/')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && error.config?.headers?.Authorization) {
            localStorage.removeItem('quantix_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getApiError = (error, fallback = 'Operation failed. Please try again.') => {
    const response = error.response?.data;
    const errors = response?.errors;
    if (errors) {
        const messages = Array.isArray(errors) ? errors : Object.values(errors).flat();
        if (messages.length > 0) return messages.join(' ');
    }
    return response?.message || response?.title || fallback;
};

export default api;
