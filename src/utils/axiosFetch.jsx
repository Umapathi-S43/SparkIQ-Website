import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: baseUrl, // Set your base URL here
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken) {
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      // Optionally, handle the case where there is no JWT token
      console.error('No JWT token found. Please log in.');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
