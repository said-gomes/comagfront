import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  console.log("Is user authenticated?", auth?.isAuthenticated);
  console.log("User data:", auth?.user);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;