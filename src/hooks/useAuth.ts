import { useEffect, useState } from "react";
import { parseJwt } from "../utils/jwt";
import { User } from "../types";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const idToken = sessionStorage.getItem("id_token");

    if (accessToken && idToken) {
      setIsAuthenticated(true);
      const decodedToken = parseJwt(accessToken);
      if (decodedToken) {
        setCurrentUser({
          userId: decodedToken.sub,
          email: decodedToken.email,
          accessLevel: decodedToken.accessLevel || "VIEWER",
        });
      }
    }
  }, []);

  const login = () => {
    window.location.href = import.meta.env.VITE_COGNITO_LOGIN_URL;
  };

  return { isAuthenticated, login, currentUser };
};
