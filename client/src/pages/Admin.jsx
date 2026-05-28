import { useLoaderData, redirect, useRevalidator } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  Heart,
  TrendingUp,
  Award,
  DollarSign,
  Activity,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  Ban,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Layers,
  Settings,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Dashboard";
import { useAdminContext } from "./AdminLayout";

// Loader to pull all CEO Analytics, Recruiter lists, and Seekers lists concurrently
export const loader = async () => {
  try {
    const [analyticsRes, employersRes, seekersRes] = await Promise.all([
      customFetch.get("/admin/ceo-analytics"),
      customFetch.get("/admin/employers"),
      customFetch.get("/employers/all-seekers"),
    ]);

    return {
      kpis: analyticsRes.data.kpis,
      growth: analyticsRes.data.growth,
      monthlyGrowth: analyticsRes.data.monthlyGrowth,
      dailyApplications: analyticsRes.data.dailyApplications,
      planDistribution: analyticsRes.data.planDistribution,
      jobStatusBreakdown: analyticsRes.data.jobStatusBreakdown,
      jobTypeBreakdown: analyticsRes.data.jobTypeBreakdown,
      topSpecializations: analyticsRes.data.topSpecializations,
      topSeekerSpecializations: analyticsRes.data.topSeekerSpecializations,
      blogCategories: analyticsRes.data.blogCategories,
      topLocations: analyticsRes.data.topLocations,
      applicationFunnel: analyticsRes.data.applicationFunnel,
      compatibilityBuckets: analyticsRes.data.compatibilityBuckets,
      engagement: analyticsRes.data.engagement,
      financials: analyticsRes.data.financials,
      health: analyticsRes.data.health,
      recentRecruiters: analyticsRes.data.recentRecruiters,
      recentJobSeekers: analyticsRes.data.recentJobSeekers,
      topJobsByApplications: analyticsRes.data.topJobsByApplications,
      quotaUtilization: analyticsRes.data.quotaUtilization,
      topBlogsByViews: analyticsRes.data.topBlogsByViews,
      today: analyticsRes.data.today,
      generatedAt: analyticsRes.data.generatedAt,
      employers: employersRes.data.users || [],
      seekers: seekersRes.data.jobSeekers || [],
    };
  } catch (error) {
    console.error("Error fetching CEO admin stats:", error);
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (!isAuthError) {
      toast.error("Access Denied — Restored to CEO Security Bounds.");
    }
    return redirect("/dashboard");
  }
};

const PLAN_COLORS = {
  trial: "#94a3b8",      // slate-400
  basic: "#0ea5e9",      // sky-500
  pro: "#6366f1",        // indigo-500
  enterprise: "#a855f7"  // purple-500
};

const Admin = () => {
  const data = useLoaderData();
  const revalidator = useRevalidator();
  
  // Navigation tabs state
  const { activeTab, setActiveTab } = useAdminContext();

  // Filter states
  const [recruiterSearch, setRecruiterSearch] = useState("");
  const [recruiterPlanFilter, setRecruiterPlanFilter] = useState("all");
  const [recruiterStatusFilter, setRecruiterStatusFilter] = useState("all");

  const [seekerSearch, setSeekerSearch] = useState("");
  const [seekerSpecFilter, setSeekerSpecFilter] = useState("all");
  
  // In-line editing state for recruiter quotas
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [quotaInputValue, setQuotaInputValue] = useState("");

  // Revalidate state wrapper
  const [isUpdating, setIsUpdating] = useState(false);

  // ─── Event Handlers ────────────────────────────────────────────────────────
  const handleUpdateStatus = async (employerId, currentStatus) => {
    let nextStatus = "approved";
    if (currentStatus === "approved") {
      nextStatus = "blocked";
    } else if (currentStatus === "blocked") {
      nextStatus = "approved";
    } else if (currentStatus === "pending") {
      nextStatus = "approved";
    }

    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/employers/${employerId}/status`, { status: nextStatus });
      toast.success(res.data.msg || `Status successfully updated to ${nextStatus}`);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update recruiter status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveQuota = async (employerId) => {
    const quotaVal = Number(quotaInputValue);
    if (isNaN(quotaVal) || quotaVal < 0) {
      toast.error("Please enter a valid positive number for the quota.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/employers/${employerId}/quota`, { jobOffersQuota: quotaVal });
      toast.success(res.data.msg || "Quota limit updated successfully.");
      setEditingQuotaId(null);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update quota.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePlanChange = async (employerId, newPlan) => {
    setIsUpdating(true);
    try {
      const res = await customFetch.patch(`/admin/employers/${employerId}/quota`, { plan: newPlan });
      toast.success(res.data.msg || `Recruiter subscription set to ${newPlan.toUpperCase()}`);
      revalidator.revalidate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update subscription tier.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!data || !data.kpis) {
    return (
      <Wrapper className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Loading admin dashboard data...</p>
        </div>
      </Wrapper>
    );
  }

  // ─── Filter Calculations ───────────────────────────────────────────────────
  const filteredRecruiters = data.employers.filter(emp => {
    // Exclude the logged-in admin from listing as manageable recruiter to avoid self-modification
    if (emp.role === "admin") return false;
    
    const matchesSearch = emp.name.toLowerCase().includes(recruiterSearch.toLowerCase()) || 
                          emp.lastName.toLowerCase().includes(recruiterSearch.toLowerCase()) || 
                          emp.email.toLowerCase().includes(recruiterSearch.toLowerCase()) ||
                          (emp.location && emp.location.toLowerCase().includes(recruiterSearch.toLowerCase()));
    
    const matchesPlan = recruiterPlanFilter === "all" ? true : emp.plan === recruiterPlanFilter;
    const matchesStatus = recruiterStatusFilter === "all" ? true : emp.status === recruiterStatusFilter;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const filteredSeekers = data.seekers.filter(seek => {
    const matchesSearch = seek.name.toLowerCase().includes(seekerSearch.toLowerCase()) ||
                          seek.lastName.toLowerCase().includes(seekerSearch.toLowerCase()) ||
                          seek.email.toLowerCase().includes(seekerSearch.toLowerCase()) ||
                          (seek.location && seek.location.toLowerCase().includes(seekerSearch.toLowerCase()));
    
    const matchesSpec = seekerSpecFilter === "all" ? true : seek.specialization === seekerSpecFilter;
    
    return matchesSearch && matchesSpec;
  });

  // Unique list of seeker specializations for filter dropdown
  const uniqueSeekerSpecs = [...new Set(data.seekers.map(s => s.specialization).filter(Boolean))];

  // Formatting currency helper (DZD cents to Dinars, wait, the seeder uses raw Dinars, let's keep it format-friendly)
  const formatDinar = (val) => {
    return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Wrapper className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            CEO Command Centre
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Platform Owner Session
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics engine & database operations hub.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <Clock className="h-4 w-4 text-indigo-500" />
          <span>Synced at: {new Date(data.generatedAt).toLocaleTimeString()}</span>
          {isUpdating && <span className="text-indigo-500 font-medium animate-pulse ml-2">Refreshing...</span>}
        </div>
      </div>


      {/* ─── TAB CONTENT: OVERVIEW ─────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Active Users</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{data.kpis.totalUsers}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-green-600 dark:text-green-400">
                      <ArrowUpRight className="h-3 w-3" />
                      +{data.growth.recruiters.pct + data.growth.seekers.pct}%
                    </span>
                    <span className="text-slate-400">MoM Growth</span>
                  </div>
                </div>
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recruiter Accounts</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{data.kpis.totalRecruiters}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span className={`flex items-center gap-0.5 font-bold ${data.growth.recruiters.pct >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {data.growth.recruiters.pct >= 0 ? "+" : ""}{data.growth.recruiters.pct}%
                    </span>
                    <span className="text-slate-400">this month ({data.growth.recruiters.thisMonth})</span>
                  </div>
                </div>
                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Medical Job Listings</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{data.kpis.totalJobs}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-green-600 dark:text-green-400">
                      <ArrowUpRight className="h-3 w-3" />
                      +{data.growth.jobs.pct}%
                    </span>
                    <span className="text-slate-400">this month ({data.growth.jobs.thisMonth})</span>
                  </div>
                </div>
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Applications</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{data.kpis.totalApplications}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-green-600 dark:text-green-400">
                      <ArrowUpRight className="h-3 w-3" />
                      +{data.growth.applications.pct}%
                    </span>
                    <span className="text-slate-400">this month ({data.growth.applications.thisMonth})</span>
                  </div>
                </div>
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100/50 dark:border-rose-900/30">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Pulse */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                Today's Platform Pulse
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { value: data.today.newRecruiters, label: "New Recruiters", color: "border-sky-500 text-sky-500 bg-sky-50/20" },
                  { value: data.today.newJobSeekers, label: "New Professionals", color: "border-indigo-500 text-indigo-500 bg-indigo-50/20" },
                  { value: data.today.newJobs, label: "New Jobs Posted", color: "border-emerald-500 text-emerald-500 bg-emerald-50/20" },
                  { value: data.today.newApplications, label: "New Applications", color: "border-rose-500 text-rose-500 bg-rose-50/20" },
                  { value: data.today.newMessages, label: "Chat Exchange", color: "border-purple-500 text-purple-500 bg-purple-50/20" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border border-l-4 ${item.color} flex flex-col justify-between`}>
                    <span className="text-2xl font-black">{item.value}</span>
                    <span className="text-xs font-semibold text-slate-500 mt-2 block leading-snug">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Health Score Indicators */}
              <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Core Ecosystem Health Indexes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Recruiter-to-Seeker Ratio</span>
                      <span className="text-slate-800 dark:text-slate-200">1 : {(data.kpis.totalJobSeekers / (data.kpis.totalRecruiters || 1)).toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${Math.min((data.kpis.totalJobSeekers / (data.kpis.totalRecruiters || 1)) * 10, 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Confirm Activation Rate</span>
                      <span className="text-slate-800 dark:text-slate-200">{data.health.activationRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${data.health.activationRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Premium Talent Penetration</span>
                      <span className="text-slate-800 dark:text-slate-200">{data.health.seekerPremiumRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: `${data.health.seekerPremiumRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Settings Quick Access */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-400" />
                  Management Shortcuts
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Instantly navigate to manage critical assets.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab("recruiters")}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 text-left text-sm font-semibold transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-500" />
                      Manage Hospital Accounts
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("seekers")}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 text-left text-sm font-semibold transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-sky-500" />
                      Browse Medical CVs
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("financials")}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 text-left text-sm font-semibold transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Review Financial Model
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Status Alert panel */}
              <div className="mt-6 p-4 rounded-xl border border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-950/10 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Review Pending Approvals</h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-1 leading-snug">
                    {data.kpis.pendingRecruiters} recruiter signups are currently awaiting administrative credentials check.
                  </p>
                  {data.kpis.pendingRecruiters > 0 && (
                    <button 
                      onClick={() => {
                        setRecruiterStatusFilter("pending");
                        setActiveTab("recruiters");
                      }}
                      className="mt-2 text-xs font-black text-amber-800 dark:text-amber-400 underline hover:no-underline"
                    >
                      Process Pending Registrations &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT: FINANCIAL ENGINE ───────────────────────────────── */}
      {activeTab === "financials" && (
        <div className="space-y-8 animate-fadeIn">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Engine KPI Summary</h2>
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md border border-indigo-400/20 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-6">
                <DollarSign className="h-40 w-40" />
              </div>
              <p className="text-xs font-semibold opacity-85 uppercase tracking-wider">Current Monthly Recurring Revenue (MRR)</p>
              <h3 className="text-4xl font-black mt-3">{formatDinar(data.financials.currentMRR)}</h3>
              <div className="flex items-center gap-1.5 mt-4 text-xs bg-white/15 w-fit px-2.5 py-1 rounded-full">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Annualized run-rate: {formatDinar(data.financials.currentMRR * 12)}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subscriber Penetration</p>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{data.financials.paidUsers}</span>
                  <span className="text-xs text-slate-400">paid out of {data.kpis.totalRecruiters} recruiters</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-indigo-500 h-full" style={{ width: `${data.financials.conversionRate}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                <span>Free Trial accounts: {data.financials.trialUsers}</span>
                <span className="font-bold text-indigo-500">{data.financials.conversionRate}% Conv. Rate</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Unit Economics (LTV)</p>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatDinar(data.financials.estimatedLTV)}</span>
                  <span className="text-xs text-slate-400">12-Month LTV</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Based on Average Revenue Per User (ARPU) of {formatDinar(data.financials.estimatedARPU)} / month.
                </p>
              </div>
              <div className="text-xs text-slate-400 flex justify-between mt-4">
                <span>Monthly ARPU: {formatDinar(data.financials.estimatedARPU)}</span>
                <span className="font-semibold text-indigo-500">DZD Metric</span>
              </div>
            </div>
          </div>

          {/* Revenue Projection Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">6-Month MRR Projections</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Simulating 30% cumulative conversion of {data.financials.trialUsers} active trial accounts.
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Projected MRR
                  </span>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.financials.projectedMRR6Months} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="financialProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(tick) => `${tick / 1000}k`} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [formatDinar(value), "Projected MRR"]}
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#financialProj)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plans Distribution Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Subscription Share</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Distribution of recruiter billing plans.</p>

                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.financials.revenueByPlan}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="count"
                      >
                        {data.financials.revenueByPlan.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.plan] || "#6366f1"} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} active`, props.payload.plan.toUpperCase()]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4">
                  {data.financials.revenueByPlan.map((planData, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PLAN_COLORS[planData.plan] }} />
                        <span className="capitalize">{planData.plan}</span>
                      </div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{planData.count} accounts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center font-medium">
                Standard pricing range: 0 to 50k DZD / month.
              </div>
            </div>
          </div>

          {/* Detailed Revenue Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Plan-by-Plan Revenue Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3.5">Subscription Tier</th>
                    <th className="pb-3.5">Unit Price (Monthly)</th>
                    <th className="pb-3.5">Active Subscribers</th>
                    <th className="pb-3.5">Current MRR</th>
                    <th className="pb-3.5">Projected Annual Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.financials.revenueByPlan.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PLAN_COLORS[row.plan] }} />
                        {row.plan}
                      </td>
                      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-400">
                        {formatDinar(data.financials.pricingDZA[row.plan])}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-950 dark:text-white">
                        {row.count}
                      </td>
                      <td className="py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                        {formatDinar(row.monthlyRevenue)}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {formatDinar(row.annualRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT: RECRUITERS MANAGEMENT ──────────────────────────── */}
      {activeTab === "recruiters" && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter Accounts Registry</h2>
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search recruiters by name, email or city..."
                value={recruiterSearch}
                onChange={(e) => setRecruiterSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">Filters:</span>
              </div>

              <select
                value={recruiterPlanFilter}
                onChange={(e) => setRecruiterPlanFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="all">All Plans</option>
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <select
                value={recruiterStatusFilter}
                onChange={(e) => setRecruiterStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Manageable Recruiters List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="p-4">Recruiter Hospital / Clinic</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Subscription Plan</th>
                    <th className="p-4">Quota Utilized</th>
                    <th className="p-4">Auth Verification</th>
                    <th className="p-4">Platform Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecruiters.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                        No recruiters found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecruiters.map((emp) => {
                      const isPending = emp.status === "pending";
                      const isBlocked = emp.status === "blocked";
                      const isEditingQuota = editingQuotaId === emp._id;
                      
                      return (
                        <tr key={emp._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          {/* Name / Email */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {emp.name} {emp.lastName}
                            </div>
                            <div className="text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                              <Mail className="h-3 w-3 shrink-0" />
                              {emp.email}
                            </div>
                          </td>

                          {/* Location */}
                          <td className="p-4">
                            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              {emp.location || "Not Provided"}
                            </div>
                          </td>

                          {/* Plan Dropdown */}
                          <td className="p-4">
                            <select
                              value={emp.plan}
                              onChange={(e) => handlePlanChange(emp._id, e.target.value)}
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-bold text-[10px] uppercase tracking-wide focus:outline-none"
                              style={{ color: PLAN_COLORS[emp.plan] }}
                            >
                              <option value="trial" style={{ color: PLAN_COLORS.trial }}>Trial</option>
                              <option value="basic" style={{ color: PLAN_COLORS.basic }}>Basic</option>
                              <option value="pro" style={{ color: PLAN_COLORS.pro }}>Pro</option>
                              <option value="enterprise" style={{ color: PLAN_COLORS.enterprise }}>Enterprise</option>
                            </select>
                          </td>

                          {/* Quota Settings Inline */}
                          <td className="p-4">
                            {isEditingQuota ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={quotaInputValue}
                                  onChange={(e) => setQuotaInputValue(e.target.value)}
                                  className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white font-bold"
                                />
                                <button
                                  onClick={() => handleSaveQuota(emp._id)}
                                  className="p-1 rounded bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setEditingQuotaId(null)}
                                  className="p-1 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                                >
                                  <Ban className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {emp.lifetimeJobOffersCreated} / {emp.jobOffersQuota}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingQuotaId(emp._id);
                                    setQuotaInputValue(String(emp.jobOffersQuota));
                                  }}
                                  className="text-[10px] font-black text-indigo-500 hover:underline"
                                >
                                  Adjust
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Email Confirmed OTP Status */}
                          <td className="p-4">
                            {emp.isConfirmed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                                <Check className="h-3 w-3" /> Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                                <AlertCircle className="h-3 w-3" /> Unverified
                              </span>
                            )}
                          </td>

                          {/* Account Status Badge */}
                          <td className="p-4">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50">
                                Pending Approval
                              </span>
                            ) : isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50">
                                Suspended / Blocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50">
                                Active / Approved
                              </span>
                            )}
                          </td>

                          {/* Status Modifiers Actions */}
                          <td className="p-4 text-right">
                            {isPending ? (
                              <button
                                onClick={() => handleUpdateStatus(emp._id, "pending")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-green-500 hover:bg-green-600 text-white shadow-sm"
                              >
                                Approve Account
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(emp._id, emp.status)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${
                                  isBlocked 
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300"
                                }`}
                              >
                                {isBlocked ? "Unblock" : "Block Recruiter"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT: JOB SEEKERS MANAGEMENT ─────────────────────────── */}
      {activeTab === "seekers" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search job seekers by name, email or city..."
                value={seekerSearch}
                onChange={(e) => setSeekerSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={seekerSpecFilter}
                onChange={(e) => setSeekerSpecFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="all">All Specialties</option>
                {uniqueSeekerSpecs.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Seekers Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="p-4">Medical Professional</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Premium Membership</th>
                    <th className="p-4">Account Creation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSeekers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                        No medical professionals found matching the filter bounds.
                      </td>
                    </tr>
                  ) : (
                    filteredSeekers.map((seek) => (
                      <tr key={seek._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        {/* Name / Email */}
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {seek.name} {seek.lastName}
                          </div>
                          <div className="text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                            <Mail className="h-3 w-3 shrink-0" />
                            {seek.email}
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50/55 text-indigo-700 border border-indigo-100/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/20">
                            {seek.specialization || "Not Set"}
                          </span>
                        </td>

                        {/* City/Location */}
                        <td className="p-4">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            {seek.location || "Unknown"}
                          </div>
                        </td>

                        {/* Confirmed OTP status */}
                        <td className="p-4">
                          {seek.isConfirmed ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3.5 w-3.5" /> Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
                              <AlertCircle className="h-3.5 w-3.5" /> Unconfirmed
                            </span>
                          )}
                        </td>

                        {/* Premium Status Badge */}
                        <td className="p-4">
                          {seek.isPremium ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white shadow-sm tracking-wider uppercase animate-pulse">
                              Premium Gold
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Standard Free
                            </span>
                          )}
                        </td>

                        {/* Date Created */}
                        <td className="p-4 text-slate-500 font-medium">
                          {new Date(seek.createdAt).toLocaleDateString("fr-DZ")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT: INSIGHTS & PLATFORM HEALTH ─────────────────────────── */}
      {activeTab === "insights" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Aggregated Registration Growth Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform Registrations Growth (6-Month Trend)</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Growth progression of recruiters and job seekers monthly.</p>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyGrowth} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Bar dataKey="seekers" name="Job Seekers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recruiters" name="Recruiters" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="applications" name="Applications" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Application Funnel Analytics */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Application Pipeline Funnel</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Aggregate ratios of placements and conversions.</p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: "Applied", count: data.applicationFunnel.applied, fill: "#6366f1" },
                        { name: "Viewed", count: data.applicationFunnel.viewed, fill: "#0ea5e9" },
                        { name: "Accepted", count: data.applicationFunnel.accepted, fill: "#10b981" },
                        { name: "Rejected", count: data.applicationFunnel.rejected, fill: "#f43f5e" }
                      ]}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {[
                          { fill: "#6366f1" },
                          { fill: "#0ea5e9" },
                          { fill: "#10b981" },
                          { fill: "#f43f5e" }
                        ].map((cell, idx) => (
                          <Cell key={`cell-${idx}`} fill={cell.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500 font-medium">
                <span>Total Applications: {data.kpis.totalApplications}</span>
                <span className="font-bold text-emerald-500">Funnel Placement Rate: {data.health.acceptanceRate}%</span>
              </div>
            </div>

            {/* Top Job Specializations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Demand by Specializations</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Top hospital requirements in Algeria.</p>

              <div className="space-y-4">
                {data.topSpecializations.slice(0, 5).map((spec, index) => {
                  const percentage = Math.round((spec.count / (data.kpis.totalJobs || 1)) * 100);
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 dark:text-slate-300">{spec._id}</span>
                        <span className="text-slate-400">{spec.count} postings ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Platform Health Checkups</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-lg">
                    <span className="text-slate-400 block mb-1">Avg Candidates / Job</span>
                    <span className="text-lg font-black text-slate-850 dark:text-slate-100">{data.health.avgAppsPerJob}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-lg">
                    <span className="text-slate-400 block mb-1">Apply Conversion Rate</span>
                    <span className="text-lg font-black text-indigo-500">{data.health.viewToApplyRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default Admin;
