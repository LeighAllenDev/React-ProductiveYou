import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.error("Error fetching current user:", err);
      // Handle error as needed
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    let isRefreshing = false;
    let subscribers = [];

    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        // Add token to request headers if available
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response && error.response.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const refreshToken = localStorage.getItem("refreshToken");
              const response = await axios.post(
                "/dj-rest-auth/token/refresh/",
                { refresh: refreshToken }
              );

              const newAccessToken = response.data.access;
              localStorage.setItem("accessToken", newAccessToken);

              subscribers.forEach((callback) => callback(newAccessToken));
              subscribers = [];
              return axios(originalRequest);
            } catch (refreshError) {
              console.error("Refresh token request failed:", refreshError);
              // Handle refresh token request errors
              // Redirect to signin page if refresh token fails
              // Example: window.location.href = '/signin';
            } finally {
              isRefreshing = false;
            }
          } else {
            // Queue up the request and wait for token refresh
            return new Promise((resolve) => {
              subscribers.push((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axios(originalRequest));
              });
            });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};