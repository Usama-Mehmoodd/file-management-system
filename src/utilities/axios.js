import axios from 'axios';

const api = axios.create({
//   baseURL: import.meta.env.VITE_PROD_URL,
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export default api;