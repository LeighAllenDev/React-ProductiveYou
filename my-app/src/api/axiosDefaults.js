import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL and default headers setup
axios.defaults.baseURL = 'https://productive-you-api-d9afbaf8a80b.herokuapp.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Ensure credentials are sent with requests

// CSRF token handling
const csrftoken = Cookies.get('csrftoken');
if (csrftoken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
}

// Create axios instances (if needed for specific purposes)
export const axiosReq = axios.create(); // Example instance for requests
export const axiosRes = axios.create(); // Example instance for responses

// Response interceptor to handle 401 Unauthorized errors
axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshedToken = await refreshToken(); // Refresh token asynchronously
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${refreshedToken.access}`;
        return axiosReq(config); // Retry request with new token
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Handle token refresh failure (e.g., redirect to login)
      }
    }
    return Promise.reject(error);
  }
);

// Function to refresh authentication token
export const refreshToken = async () => {
  try {
    const response = await axios.post('/dj-rest-auth/token/refresh/', {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error('Error refreshing token:', err);
    throw err; // Propagate error for higher-level handling
  }
};

// Function to check authenticated user
export const checkUser = async () => {
  try {
    const response = await axios.get('/dj-rest-auth/user/', {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error('Error checking user:', err);
    throw err; // Propagate error for higher-level handling
  }
};
