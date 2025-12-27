import { Stats } from "@/components/adminPage/Stats";
import { RecentBookings } from "@/components/adminPage/RecentBookings";
import { QuickActions } from "@/components/adminPage/QuickActions";

export const AdminDashboard = () => {
  return (
    <div className="w-full bg-slate-50 space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-lg">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <Stats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBookings />
        <QuickActions />
      </div>
    </div>
  );
};

export default AdminDashboard;
