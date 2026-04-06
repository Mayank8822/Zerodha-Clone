import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import "./AuthPage.css";

function DashboardRedirect() {
  useEffect(() => {
    window.location.href = "http://localhost:3001/dashboard";
  }, []);
  return null;
}

function AuthPage() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route
        path="/login"
        element={
          <div className="auth_page">
            <Login />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="auth_page">
            <Signup />
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AuthPage;
