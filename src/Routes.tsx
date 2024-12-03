import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./pages/Callback";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="callback" element={<Callback />} />
    </Routes>
  );
};
