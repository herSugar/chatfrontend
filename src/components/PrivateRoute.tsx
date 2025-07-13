import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem("auth_token"); // bisa pakai Firebase UID, atau session ID

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
