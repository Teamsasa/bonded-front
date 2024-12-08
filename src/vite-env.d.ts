/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COGNITO_LOGIN_URL: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_CLIENT_SECRET: string;
  readonly VITE_COGNITO_REDIRECT_URI: string;
  readonly VITE_COGNITO_TOKEN_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
