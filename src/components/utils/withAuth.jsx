// components/utils/withAuth.tsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const location = useLocation();

  if (!jwtToken) {
    // Redirect to login if no token is found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Return the protected element if authenticated
  return element;
};

export default ProtectedRoute;
