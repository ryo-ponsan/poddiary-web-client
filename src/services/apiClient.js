import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',  // バックエンドのURL
});

// リクエストインターセプターでトークンを付与
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;