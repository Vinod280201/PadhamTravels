import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return children;
};
