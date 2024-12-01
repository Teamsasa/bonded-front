import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Callback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const fetchTokens = async (code: string) => {
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
	  const clientSecret = import.meta.env.VITE_COGNITO_CLIENT_SECRET;
      const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
      const tokenUrl = import.meta.env.VITE_COGNITO_TOKEN_URL;

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("code", code);
      params.append("redirect_uri", redirectUri);

      try {
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        if (response.ok) {
          const data = await response.json();
          saveTokens(data);
        } else {
          console.error("Failed to fetch tokens");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    const saveTokens = (data: any) => {
      const { access_token, id_token, refresh_token } = data;

      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("id_token", id_token);
      sessionStorage.setItem("refresh_token", refresh_token);

      window.location.href = "/";
    };

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");

    if (code) {
      fetchTokens(code);
    } else {
      console.error("Authorization code not found");
    }
  }, [location]);

  return (
    <div>
      <h1>認証中...</h1>
    </div>
  );
};

export default Callback;
