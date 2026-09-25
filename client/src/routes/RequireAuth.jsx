import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";

export const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center font-semibold text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export default RequireAuth;
