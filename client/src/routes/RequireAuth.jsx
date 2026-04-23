import { Navigate, useLocation, Outlet } from "react-router-dom"; // 1. Added Outlet
import { useAuthUser } from "@/hooks/useAuthUser";

export const RequireAuth = () => {
  // 2. Removed { children } prop
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    // Optional: Return a spinner here so it's not a white screen while loading
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    const from = location.pathname + location.search;
    console.log("✈️ RequireAuth Triggered! Saving state for login redirect:", location.state);
    return <Navigate to="/login" state={{ from, originalState: location.state }} replace />;
  }

  // 3. Use Outlet to render the child routes (like HomePage)
  return <Outlet />;
};
