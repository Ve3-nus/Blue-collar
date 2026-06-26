import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Debugging
  console.log("ProtectedRoute User:", user);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User exists, allow access
  return children;
}