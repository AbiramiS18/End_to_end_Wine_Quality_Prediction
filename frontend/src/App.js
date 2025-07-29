// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Prediction from "./pages/Prediction";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
