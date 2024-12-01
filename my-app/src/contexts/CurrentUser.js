import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current user on mount
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.error("Error fetching current user:", err);
      setCurrentUser(null); // Clear user if there’s an error (e.g., session expired)
    } finally {
      setIsLoading(false); // Mark loading complete
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Add interceptor to refresh tokens and retry failed requests
  useEffect(() => {
    let isRefreshing = false;
    let subscribers = [];

    const requestInterceptor = axiosReq.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (!isRefreshing) {
            isRefreshing = true;
            originalRequest._retry = true;

            try {
              const refreshToken = localStorage.getItem("refreshToken");
              const { data } = await axios.post("/dj-rest-auth/token/refresh/", {
                refresh: refreshToken,
              });

              const newAccessToken = data.access;
              localStorage.setItem("accessToken", newAccessToken);

              // Notify all subscribers with the new token
              subscribers.forEach((callback) => callback(newAccessToken));
              subscribers = [];

              return axiosReq(originalRequest); // Retry the original request
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
              setCurrentUser(null); // Log the user out
            } finally {
              isRefreshing = false;
            }
          } else {
            // Add requests to the subscriber queue while refreshing
            return new Promise((resolve) => {
              subscribers.push((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axiosReq(originalRequest));
              });
            });
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {isLoading ? null : children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
