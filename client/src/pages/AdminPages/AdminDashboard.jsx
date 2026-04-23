import { Stats } from "@/components/adminPage/Stats";
import { RecentBookings } from "@/components/adminPage/RecentBookings";
import { QuickActions } from "@/components/adminPage/QuickActions";
import axios from "axios";
import { useEffect, useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { FaPlane } from "react-icons/fa6";

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [commissionDetails, setCommissionDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);

  // 1. PERSISTENCE: Initialize state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("agencySynced") === "true";
  });

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyCode: "",
  });

  // Handle Modal Opening - Resetting form data to ensure no pre-filled values persist in state
  const handleOpenModal = () => {
    setFormData({ email: "", password: "", companyCode: "" });
    setShowModal(true);
  };

  // 2. BACKEND SYNC: Verify with the server on mount
  useEffect(() => {
    const verifySyncWithBackend = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/sync-status`,
        );

        if (response.data.isSynced) {
          setIsLoggedIn(true);
          localStorage.setItem("agencySynced", "true");
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("agencySynced");
        }
      } catch (err) {
        console.error("Backend sync check failed.");
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/bookings/dashboard-stats`
        );
        if (response.data.status) {
          setDashboardStats(response.data.stats);
          setRecentBookings(response.data.recentAdminBookings);
          setCommissionDetails(response.data.commissionDetails || []);
          setCustomerDetails(response.data.customerDetails || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    verifySyncWithBackend();
    fetchDashboardStats();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgencyLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/agency-login`,
        formData,
      );

      if (response.data.success) {
        localStorage.setItem("agencySynced", "true");
        setIsLoggedIn(true);
        setShowModal(false);
        alert("✅ Agency Login Successful! Flight data synced.");
      } else {
        alert("❌ Failed to log in: " + response.data.message);
      }
    } catch (error) {
      console.error("Agency Login Error:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 space-y-5 py-3 md:p-6 relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-lg">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-xl font-bold border border-green-200 shadow-sm transition-all animate-in fade-in slide-in-from-right-4">
            <CheckCircle size={20} className="text-green-500" />
            <span>Agency API Active</span>
            <span className="relative flex h-3 w-3 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        ) : (
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <FaPlane className="rotate-45 text-sm" />
            Agency Login
          </button>
        )}
      </div>

      {/* --- POP-UP MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                Agency Portal
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Synchronize your Padham Travel dashboard with the live Flight
                API.
              </p>
            </div>

            {/* Added autoComplete="off" to form and specific props to inputs */}
            <form
              onSubmit={handleAgencyLogin}
              className="space-y-5"
              autoComplete="off"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Agency Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="off"
                  data-lpignore="true"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="admin@padhamtravels.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Agency Code
                </label>
                <input
                  required
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="e.g. MJK789"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-black text-white transition-all mt-4 flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 active:translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Syncing Data...
                  </>
                ) : (
                  "Sync Agency API"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats and Activity Grid */}
      <Stats dashboardStats={dashboardStats} commissionDetails={commissionDetails} customerDetails={customerDetails} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <RecentBookings recentBookings={recentBookings} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
