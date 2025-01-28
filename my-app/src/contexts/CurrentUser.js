import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    let isRefreshing = false;
    let subscribers = [];

    const addSubscriber = (callback) => subscribers.push(callback);

    const notifySubscribers = (newToken) => {
      subscribers.forEach((callback) => callback(newToken));
      subscribers = [];
    };

    const refreshAccessToken = async () => {
      try {
        const { data } = await axiosReq.post("/dj-rest-auth/token/refresh/");
        const newAccessToken = data.access;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      } catch (err) {
        console.error("Failed to refresh token:", err);
        setCurrentUser(null);
        navigate("/signin"); // Redirect to login page on token refresh failure
        throw err;
      }
    };

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
          originalRequest._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newAccessToken = await refreshAccessToken();
              notifySubscribers(newAccessToken);
              return axiosReq(originalRequest);
            } catch (err) {
              console.error("Token refresh failed:", err);
              throw err;
            } finally {
              isRefreshing = false;
            }
          } else {
            return new Promise((resolve) => {
              addSubscriber((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(axiosReq(originalRequest));
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
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
