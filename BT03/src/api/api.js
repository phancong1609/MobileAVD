import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.161:3000',  // Replace with your backend URL
});

export default api;
