import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'https://productive-you-api-d9afbaf8a80b.herokuapp.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Add CSRF token from cookies if available
const csrftoken = Cookies.get('csrftoken');
if (csrftoken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
}

// Create axios instances for requests and responses
export const axiosReq = axios.create({
  baseURL: axios.defaults.baseURL,
  withCredentials: true,
  headers: {
    ...axios.defaults.headers.common,
  },
});

export const axiosRes = axios.create({
  baseURL: axios.defaults.baseURL,
  withCredentials: true,
  headers: {
    ...axios.defaults.headers.common,
  },
});

// Function to refresh the JWT access token
export const refreshToken = async () => {
  try {
    const response = await axiosReq.post('/dj-rest-auth/token/refresh/');
    const { access } = response.data;

    // Update the JWT access token in cookies
    Cookies.set('my-app-auth', access, {
      secure: true,
      sameSite: 'None',
    });

    return access;
  } catch (err) {
    console.error('Error refreshing token:', err);
    throw err;
  }
};

// Function to check authenticated user
export const checkUser = async () => {
  try {
    const response = await axiosRes.get('/dj-rest-auth/user/');
    return response.data;
  } catch (err) {
    console.error('Error checking user:', err);
    throw err;
  }
};

// Interceptor to add Authorization header to requests
axiosReq.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('my-app-auth');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh on 401 errors
axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosReq(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed, logging out:', refreshError);
        // Optionally redirect to login or logout the user
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);
