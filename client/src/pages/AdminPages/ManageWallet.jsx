import { useState, useEffect } from "react";
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Activity, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from "@/apiClient";

const ManageWallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [adminBalance, setAdminBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        console.log("📡 Fetching Wallet Balance...");
        const balanceRes = await apiGet("/wallet/balance");
        const balanceData = await balanceRes.json();
        console.log("💰 Balance Response:", balanceData);
        if (balanceData.status) {
          setAdminBalance(balanceData.balance);
        }

        console.log("📡 Fetching Wallet Transactions...");
        const transRes = await apiGet("/wallet/transactions");
        const transData = await transRes.json();
        console.log("📜 Transactions Response:", transData);
        if (transData.status) {
          setTransactions(transData.transactions || []);
        }
      } catch (error) {
        console.error("❌ Failed to fetch wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Wallet className="w-8 h-8 text-blue-600" />
          Manage Wallet
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">
          Track your API balance and monitor automated commission credits from user bookings.
        </p>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Mocked API Wallet */}
        <Card className="border-slate-200 shadow-sm relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Activity className="w-32 h-32" />
          </div>
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-800/50 border border-slate-700 p-2.5 rounded-xl">
                <Wallet className="w-6 h-6 text-sky-400" />
              </div>
              <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-md border border-sky-500/30">
                B2B Provider
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
              API Wallet (WebAndApi)
            </h3>
            <p className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              {formatINR(125000)} {/* Mock Value until API endpoint is known */}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Estimated balance. Updates on deposit.
            </p>
          </CardContent>
        </Card>

        {/* Real Admin Commission Wallet */}
        <Card className="border-emerald-200 shadow-xl shadow-emerald-100/50 relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
           <div className="absolute top-0 right-0 p-6 opacity-5">
            <TrendingUp className="w-32 h-32 text-emerald-900" />
          </div>
          <CardContent className="p-6 md:p-8 relative z-10">
             <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 border border-emerald-200 p-2.5 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                Live Revenue
              </span>
            </div>
            <h3 className="text-emerald-700/70 text-sm font-bold uppercase tracking-wider mb-1">
              My Wallet (Admin Earnings)
            </h3>
            <p className="text-2xl md:text-3xl font-black text-emerald-900 tracking-tight mb-2">
              {isLoading ? "..." : formatINR(adminBalance)}
            </p>
            <p className="text-emerald-600/80 text-sm font-medium">
              Total commissions accumulated from User flight bookings.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header & Search */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
            <p className="text-sm text-slate-500 font-medium">Recent credits and debits to My Wallet.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Ref or Details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-4">
                      {tx.bookingRef ? (
                        <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 group-hover:bg-white transition-colors">
                          {tx.bookingRef}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {tx.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg ${
                        tx.type === 'CREDIT' 
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                          : 'text-amber-700 bg-amber-50 border border-amber-100'
                      }`}>
                        {tx.type === 'CREDIT' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {tx.type === 'CREDIT' ? '+' : '-'}{formatINR(tx.amount)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                      <Wallet className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold text-lg">No transactions found</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {searchTerm ? "Try adjusting your search query." : "When users book flights, commissions will appear here."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageWallet;
