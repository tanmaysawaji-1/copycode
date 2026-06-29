import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const API_URL = "https://hungryhub-e81l.onrender.com";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          `${API_URL}/verify`,
          {},
          { withCredentials: true }
        );
        if (data.status) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsAuthenticated(false);
      }
    };
    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return <div className="empty-state">Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = "https://trading-lovat-ten.vercel.app/signup";
    return null;
  }

  return children;
};

export default ProtectedRoute;
