import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('jlpt_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

let isAlertShown = false;

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isAlertShown) {
            isAlertShown = true;
            alert('로그인이 필요합니다.');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
)

export default API
