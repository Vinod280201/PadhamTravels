// AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/adminPage/Sidebar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      // 1) clear auth info used by RequireAuth
      localStorage.removeItem("authUser");

      // 2) clear any React state you keep
      setUser(null);

      // 3) redirect to login (or landing)
      window.location.assign("/login"); // or navigate("/login")
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Common top bar with logout */}
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-b-slate-300 bg-slate-100 backdrop-blur">
          {/* Left side: breadcrumb + page title placeholder */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Padham Travels Admin Panel
            </span>
            <span className="text-sm text-slate-600">
              {user?.name ? `Logged in as ${user.name}` : "Welcome back"}
            </span>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center text-sm md:text-md font-semibold h-9 px-3 rounded text-white border border-slate-200 bg-orange-400 hover:font-bold hover:bg-orange-500 transition"
            >
              Logout
              <FiLogOut size={20} className="ml-2" />
            </button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
