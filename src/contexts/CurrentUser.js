import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearTokensAndLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setCurrentUser(null);
    };

    const fetchCurrentUser = useCallback(async () => {
        try {
            const { data } = await axiosRes.get("/dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            if (err.response?.status === 401) {
                console.warn("Unauthorized: Clearing tokens");
                clearTokensAndLogout();
            } else {
                console.error("Error fetching current user:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            fetchCurrentUser();
        } else {
            setCurrentUser(null);
            setIsLoading(false);
        }
    }, [fetchCurrentUser]);

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

                            subscribers.forEach((callback) => callback(newAccessToken));
                            subscribers = [];
                            return axiosReq(originalRequest);
                        } catch (refreshError) {
                            console.error("Error refreshing token:", refreshError);
                            clearTokensAndLogout();
                        } finally {
                            isRefreshing = false;
                        }
                    } else {
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

        return () => {
            axiosReq.interceptors.request.eject(requestInterceptor);
            axiosRes.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
