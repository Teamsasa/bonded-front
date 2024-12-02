import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./Routes.tsx";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
