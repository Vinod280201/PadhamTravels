// AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/adminPage/Sidebar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("authUser");
      console.log("🧹 CLEARED localStorage");
      setUser(null);
      console.log("👤 SET USER TO NULL");
      navigate("/", { replace: true });
    }
  };

  return (
    // 'overflow-hidden' prevents the whole page from scrolling; only the 'main' section will scroll
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden">
      {/* Sidebar Component 
          - On Mobile: It is fixed off-screen (drawer).
          - On Desktop: It sits relatively in the flex flow.
      */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header
          className="
            w-full flex items-center justify-between border-b border-slate-300 bg-slate-100 backdrop-blur z-10
            py-2 pr-4           /* Base padding */
            pl-16               /* Mobile: Extra left padding so text doesn't hide behind Sidebar Toggle */
            md:py-4 md:px-6     /* Desktop: Standard padding */
          "
        >
          {/* Left side: Page Title */}
          <div className="ml-1 pt-1.5 flex flex-col overflow-hidden">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-slate-400 truncate">
              Padham Travels Admin Panel
            </span>
            <span className="text-sm text-slate-600 truncate font-medium">
              {user?.name ? `Logged in as ${user.name}` : "Welcome back"}
            </span>
          </div>

          {/* Right side: Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="
                flex items-center justify-center shrink-0 
                text-xs md:text-sm font-semibold 
                h-8 px-2 md:h-9 md:px-3 
                rounded text-white border border-slate-200 bg-orange-400 
                hover:bg-orange-500 hover:shadow-sm transition-all
              "
            >
              <span className="hidden sm:inline">Logout</span>
              <FiLogOut size={18} className="sm:ml-2" />
            </button>
          )}
        </header>

        {/* Page Content (Scrollable Area) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
