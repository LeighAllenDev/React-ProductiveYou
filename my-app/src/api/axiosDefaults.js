import axios from 'axios';
import Cookies from 'js-cookie';

// Base API URL
axios.defaults.baseURL = 'https://productive-you-api-d9afbaf8a80b.herokuapp.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Function to get CSRF token dynamically
const getCSRFToken = () => Cookies.get('csrftoken');

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Set up request interceptor for CSRF token & Authorization header
const setRequestHeaders = (config) => {
  const csrftoken = getCSRFToken();
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }

  const accessToken = Cookies.get('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
};

axiosReq.interceptors.request.use(setRequestHeaders, (error) => Promise.reject(error));
axiosRes.interceptors.request.use(setRequestHeaders, (error) => Promise.reject(error));

// Token Refresh Function
export const refreshToken = async () => {
  try {
    const response = await axios.post('/dj-rest-auth/token/refresh/', {}, { withCredentials: true });
    const newAccessToken = response.data.access;
    
    if (newAccessToken) {
      Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'None' });
    }

    return newAccessToken;
  } catch (err) {
    console.error('Error refreshing token:', err);
    throw err;
  }
};

axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosReq(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to check authenticated user
export const checkUser = async () => {
  try {
    const response = await axios.get('/dj-rest-auth/user/', { withCredentials: true });
    return response.data;
  } catch (err) {
    console.error('Error checking user:', err);
    throw err;
  }
};