// src/routes/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    // simple loading state; replace with spinner if you want
    return null;
  }

  if (!user) {
    // not logged in -> go to login, keep where they tried to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // logged in -> render protected content
  return children;
};
