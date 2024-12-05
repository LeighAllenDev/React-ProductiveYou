import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL and default headers setup
axios.defaults.baseURL = 'https://productive-you-api-d9afbaf8a80b.herokuapp.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

const csrftoken = Cookies.get('csrftoken');
if (csrftoken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
}

export const axiosReq = axios.create();
export const axiosRes = axios.create();

axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshedToken = await refreshToken();
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${refreshedToken.access}`;
        return axiosReq(config);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
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
    throw err;
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
    throw err;
  }
};
