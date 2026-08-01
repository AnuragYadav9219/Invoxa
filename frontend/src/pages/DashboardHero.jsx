import { useMemo } from "react";
import {
  Store,
  CalendarDays,
  MapPin,
  TrendingUp,
  Receipt,
  Users,
  IndianRupee,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useGetProfileQuery } from "@/features/user/userApi";
import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";

export default function DashboardHero({ stats }) {
  const { data, isLoading: profileLoading } = useGetProfileQuery();
  const user = data?.data;

  const { data: customers = [], isLoading, isFetching } = useGetCustomerSummaryQuery();
  const totalCustomers = customers.length;

  const change = stats?.revenueChangePercent ?? 0;
  const isProfit = change >= 0;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = formatDate(new Date());

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-slate-50 via-white to-indigo-50/50 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
      
      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_50%)] transition-opacity duration-700 group-hover:opacity-75" />
      <div className="absolute -right-20 -top-20 h-64 w-64 md:h-80 md:w-80 rounded-full bg-sky-400/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute -left-20 bottom-0 h-56 w-56 md:h-72 md:w-72 rounded-full bg-indigo-500/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />

      <div className="relative z-10 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 lg:gap-12">
          
          {/* --- Left Column: Welcome & Info --- */}
          <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
            
            {/* Interactive Logo Container */}
            <div className="group/logo relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100">
              <div className="absolute inset-0 rounded-2xl bg-indigo-50 opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100" />
              <Store size={32} className="relative z-10 text-indigo-600 transition-transform duration-300 group-hover/logo:scale-110 sm:h-10 sm:w-10" />
            </div>

            {/* Shop Info */}
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10 transition-colors hover:bg-indigo-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                {greeting}
              </span>

              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 wrap-break-word">
                {user?.shopName || (profileLoading ? "Loading..." : "Your Shop")}
              </h1>

              <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-medium">
                Welcome back! Here's what's happening today.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2.5 rounded-lg bg-slate-50/50 px-3 py-1.5 border border-slate-100">
                  <CalendarDays size={18} className="text-indigo-500" />
                  <span>{today}</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-slate-50/50 px-3 py-1.5 border border-slate-100">
                  <MapPin size={18} className="text-rose-500" />
                  {profileLoading ? (
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="truncate max-w-50">{user?.address || "Address not available"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Stats Interactive Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full xl:max-w-xl">
            
            {/* Revenue Card */}
            <div className="group/card relative cursor-pointer overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white/80">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
                <div className="rounded-xl bg-emerald-100/80 p-2.5 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 truncate">
                {formatCurrency(stats?.totalRevenue || 0)}
              </h2>

              <div className={`mt-3 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                  isProfit ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                }`}
              >
                <ArrowUpRight size={14} className={`transition-transform duration-300 group-hover/card:scale-110 ${isProfit ? "" : "rotate-180"}`} />
                {Math.abs(change).toFixed(1)}% vs last month
              </div>
            </div>

            {/* Summary Card */}
            <div className="group/summary cursor-pointer flex flex-col justify-between rounded-2xl border border-white/80 bg-white/60 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white/80">
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-500">Quick Summary</p>
                <ChevronRight size={18} className="text-slate-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover/summary:opacity-100 group-hover/summary:translate-x-0" />
              </div>

              <div className="space-y-4">
                {/* Invoices */}
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 transition-colors duration-300 group-hover/item:bg-indigo-100">
                      <Receipt size={16} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 transition-colors group-hover/item:text-indigo-700">Invoices</span>
                  </div>
                  <span className="font-bold text-slate-900">{stats?.totalInvoices || 0}</span>
                </div>

                {/* Customers */}
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-50 p-2 transition-colors duration-300 group-hover/item:bg-cyan-100">
                      <Users size={16} className="text-cyan-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 transition-colors group-hover/item:text-cyan-700">Customers</span>
                  </div>
                  {isLoading || isFetching ? (
                    <div className="h-5 w-8 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <span className="font-bold text-slate-900">{totalCustomers}</span>
                  )}
                </div>

                {/* Pending */}
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2 transition-colors duration-300 group-hover/item:bg-amber-100">
                      <IndianRupee size={16} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 transition-colors group-hover/item:text-amber-700">Pending</span>
                  </div>
                  <span className="font-bold text-slate-900 truncate max-w-25 text-right">
                    {formatCurrency(stats?.totalPending || 0)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}