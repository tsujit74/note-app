import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuccessDisplay from "./components/SuccessDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* Global success messages */}
      <SuccessDisplay />
      <ErrorDisplay/>
      <Header/>

      <Routes>
       
        <Route path="/" element={<Navigate to="/login" replace />} />

       
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

       
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
