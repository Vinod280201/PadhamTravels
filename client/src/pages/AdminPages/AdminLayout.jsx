import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/adminPage/Sidebar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const { user, logout } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await logout(navigate);
  };

  return (
    <div className="h-screen w-full flex bg-[#f8fafc] overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Crisp Clean White Header Bar */}
        <header
          className="
            w-full flex items-center justify-between border-b border-slate-200 bg-white shadow-xs z-10
            py-3 pr-4 sm:pr-6 pl-14 sm:pl-16 md:pl-6
            print:hidden
          "
        >
          {/* Left side: Page Title & Welcome Pill */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 truncate">
              Padham Travels Admin Panel
            </span>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {user?.name ? `Logged in as ${user.name}` : "Welcome back, Admin"}
            </span>
          </div>

          {/* Right side: Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="
                flex items-center justify-center shrink-0 
                text-xs md:text-sm font-semibold 
                h-9 px-3.5 
                rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 
                transition-all cursor-pointer
              "
            >
              <span className="hidden sm:inline">Logout</span>
              <FiLogOut size={16} className="sm:ml-2" />
            </button>
          )}
        </header>

        {/* Page Content (Scrollable Light Canvas) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc] relative print:overflow-visible print:bg-white print:p-0 print:m-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
