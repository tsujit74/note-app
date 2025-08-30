import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuccessDisplay from "./components/SuccessDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* Global success messages */}
      <SuccessDisplay />
      <ErrorDisplay/>

      <Routes>
        {/* Default route -> signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
