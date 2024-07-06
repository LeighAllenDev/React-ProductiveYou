import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'https://productive-you-api-d9afbaf8a80b.herokuapp.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

const csrftoken = Cookies.get('csrftoken');
if (csrftoken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
}

export const axiosReq = axios.create();
export const axiosRes = axios.create();

axiosReq.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      refreshToken().then(() => {
        const config = error.config;
        return axiosReq(config);
      });
    }
    return Promise.reject(error);
  }
);

export const refreshToken = async () => {
  try {
    const response = await axios.post('/dj-rest-auth/token/refresh/', {}, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error('Error refreshing token:', err);
  }
};

export const checkUser = async () => {
  try {
    const response = await axios.get('/dj-rest-auth/user/', {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error('Error checking user:', err);
  }
};