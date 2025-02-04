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

  // Function to refresh the access token using HttpOnly cookies
  const refreshToken = async () => {
    try {
      await axiosReq.post("/dj-rest-auth/token/refresh/");
      return true; // Successful refresh
    } catch (err) {
      console.error("Token refresh failed:", err);
      setCurrentUser(null);
      navigate("/signin");
      return false;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching current user:", err);
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            const { data } = await axiosRes.get("/dj-rest-auth/user/");
            setCurrentUser(data);
          } catch (fetchErr) {
            console.error("Error fetching user after refresh:", fetchErr);
          }
        }
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
