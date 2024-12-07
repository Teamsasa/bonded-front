import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const idToken = sessionStorage.getItem("id_token");
    setIsAuthenticated(!!accessToken && !!idToken);
  }, []);

  const login = () => {
    window.location.href = import.meta.env.VITE_COGNITO_LOGIN_URL;
  };

  return { isAuthenticated, login };
};
