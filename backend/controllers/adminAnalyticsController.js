// adminAnalyticsController.js
// VitalWork — CEO Command Centre Analytics Engine
// All 25+ MongoDB aggregation pipelines run in parallel for performance.

import { StatusCodes } from "http-status-codes";
import Employer     from "../models/EmployerModel.js";
import JobSeeker    from "../models/JobSeekerModel.js";
import Job          from "../models/JobModel.js";
import Application  from "../models/ApplicationModel.js";
import Blog         from "../models/BlogModel.js";
import Message      from "../models/MessageModel.js";

// ─── Financial Model (DZA — Algerian Dinar) ──────────────────────────────────
const PLAN_PRICING_DZA = {
  trial:      0,
  basic:      12_000,
  pro:        25_000,
  enterprise: 50_000,
};

// ─── Date Utilities ───────────────────────────────────────────────────────────
const startOfDay  = (d = new Date()) => { const n = new Date(d); n.setHours(0,0,0,0); return n; };
const nDaysAgo    = (n) => { const d = new Date(); d.setDate(d.getDate()-n); d.setHours(0,0,0,0); return d; };
const startOfMonth = (ago = 0) => { const d = new Date(); d.setMonth(d.getMonth()-ago, 1); d.setHours(0,0,0,0); return d; };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const growthPct = (curr, prev) =>
  prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

// ─── Main Controller ──────────────────────────────────────────────────────────
export const getCEOAnalytics = async (req, res) => {
  try {
    const now           = new Date();
    const today         = startOfDay(now);
    const thisMonth     = startOfMonth(0);
    const lastMonth     = startOfMonth(1);
    const last7Days     = nDaysAgo(7);
    const last30Days    = nDaysAgo(30);
    const last90Days    = nDaysAgo(90);

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 1 — Platform totals (parallel)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      totalRecruiters, totalJobSeekers, totalJobs, totalApplications,
      totalBlogs, totalMessages,
      confirmedRecruiters, confirmedSeekers,
      pendingRecruiters, blockedRecruiters,
    ] = await Promise.all([
      Employer.countDocuments({ role: "employer" }),
      JobSeeker.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments(),
      Employer.countDocuments({ role: "employer", isConfirmed: true }),
      JobSeeker.countDocuments({ isConfirmed: true }),
      Employer.countDocuments({ role: "employer", status: "pending" }),
      Employer.countDocuments({ role: "employer", status: "blocked" }),
    ]);

    const totalUsers = totalRecruiters + totalJobSeekers;

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 2 — Growth metrics (this month vs last month)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      recThisM, recLastM, seekThisM, seekLastM,
      jobThisM, jobLastM, appThisM,  appLastM,
    ] = await Promise.all([
      Employer.countDocuments({ role:"employer", createdAt:{$gte:thisMonth} }),
      Employer.countDocuments({ role:"employer", createdAt:{$gte:lastMonth,$lt:thisMonth} }),
      JobSeeker.countDocuments({ createdAt:{$gte:thisMonth} }),
      JobSeeker.countDocuments({ createdAt:{$gte:lastMonth,$lt:thisMonth} }),
      Job.countDocuments({ createdAt:{$gte:thisMonth} }),
      Job.countDocuments({ createdAt:{$gte:lastMonth,$lt:thisMonth} }),
      Application.countDocuments({ createdAt:{$gte:thisMonth} }),
      Application.countDocuments({ createdAt:{$gte:lastMonth,$lt:thisMonth} }),
    ]);

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 3 — Distributions (parallel)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      planDistribution, jobStatusBreakdown, jobTypeBreakdown,
      topSpecializations, topSeekerSpecializations,
      blogCategories, topLocations,
      appFunnel, compatibilityBuckets,
    ] = await Promise.all([
      Employer.aggregate([
        { $match: { role:"employer" } },
        { $group: { _id:"$plan", count:{$sum:1} } },
        { $sort: { count:-1 } },
      ]),
      Job.aggregate([
        { $group: { _id:"$jobStatus", count:{$sum:1} } },
      ]),
      Job.aggregate([
        { $group: { _id:"$jobType", count:{$sum:1} } },
      ]),
      Job.aggregate([
        { $match: { specialization:{$ne:null} } },
        { $group: { _id:"$specialization", count:{$sum:1} } },
        { $sort: { count:-1 } },
        { $limit: 12 },
      ]),
      JobSeeker.aggregate([
        { $match: { specialization:{$exists:true,$ne:null} } },
        { $group: { _id:"$specialization", count:{$sum:1} } },
        { $sort: { count:-1 } },
        { $limit: 12 },
      ]),
      Blog.aggregate([
        { $group: { _id:"$category", count:{$sum:1} } },
        { $sort: { count:-1 } },
      ]),
      JobSeeker.aggregate([
        { $match: { location:{$exists:true,$ne:null,$ne:""} } },
        { $group: { _id:"$location", count:{$sum:1} } },
        { $sort: { count:-1 } },
        { $limit: 10 },
      ]),
      Application.aggregate([
        { $group: { _id:"$status", count:{$sum:1} } },
      ]),
      Application.aggregate([
        {
          $bucket: {
            groupBy: "$compatibilityScore",
            boundaries: [0, 20, 40, 60, 80, 101],
            default: "Other",
            output: { count:{$sum:1} },
          },
        },
      ]),
    ]);

    // Application funnel map
    const funnelMap = { applied:0, viewed:0, accepted:0, rejected:0 };
    appFunnel.forEach(({ _id, count }) => { if (_id in funnelMap) funnelMap[_id] = count; });

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 4 — Time-series data (parallel)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      monthlyRecGrowth, monthlySeekerGrowth, monthlyAppGrowth,
      dailyApps,
    ] = await Promise.all([
      Employer.aggregate([
        { $match: { role:"employer", createdAt:{$gte:startOfMonth(5)} } },
        { $group: { _id:{ year:{$year:"$createdAt"}, month:{$month:"$createdAt"} }, count:{$sum:1} } },
        { $sort: { "_id.year":1,"_id.month":1 } },
      ]),
      JobSeeker.aggregate([
        { $match: { createdAt:{$gte:startOfMonth(5)} } },
        { $group: { _id:{ year:{$year:"$createdAt"}, month:{$month:"$createdAt"} }, count:{$sum:1} } },
        { $sort: { "_id.year":1,"_id.month":1 } },
      ]),
      Application.aggregate([
        { $match: { createdAt:{$gte:startOfMonth(5)} } },
        { $group: { _id:{ year:{$year:"$createdAt"}, month:{$month:"$createdAt"} }, count:{$sum:1} } },
        { $sort: { "_id.year":1,"_id.month":1 } },
      ]),
      Application.aggregate([
        { $match: { createdAt:{$gte:last7Days} } },
        {
          $group: {
            _id:{ year:{$year:"$createdAt"}, month:{$month:"$createdAt"}, day:{$dayOfMonth:"$createdAt"} },
            count:{$sum:1},
          },
        },
        { $sort: { "_id.year":1,"_id.month":1,"_id.day":1 } },
      ]),
    ]);

    // Build 6-month grid
    const monthlyGrowth = Array.from({ length:6 }, (_,i) => {
      const d = new Date(); d.setMonth(d.getMonth()-(5-i));
      const year = d.getFullYear(), month = d.getMonth()+1, label = MONTHS[d.getMonth()];
      const find = (arr) => arr.find(r => r._id.year===year && r._id.month===month);
      return {
        label,
        recruiters:   find(monthlyRecGrowth)?.count    ?? 0,
        seekers:      find(monthlySeekerGrowth)?.count ?? 0,
        applications: find(monthlyAppGrowth)?.count    ?? 0,
      };
    });

    // Build 7-day application grid
    const dailyApplications = Array.from({ length:7 }, (_,i) => {
      const d = nDaysAgo(6-i);
      const year = d.getFullYear(), month = d.getMonth()+1, day = d.getDate();
      const label = `${MONTHS[d.getMonth()]} ${day}`;
      const found = dailyApps.find(r => r._id.year===year && r._id.month===month && r._id.day===day);
      return { label, count: found?.count ?? 0 };
    });

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 5 — Engagement metrics (parallel)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      blogViewsResult, blogLikesResult, blogCommentsResult,
      publishedBlogs, newBlogsThisMonth,
      messagesLast30Days, unreadMessages,
    ] = await Promise.all([
      Blog.aggregate([{ $group:{_id:null, total:{$sum:"$viewCount"}} }]),
      Blog.aggregate([{ $project:{lc:{$size:"$likes"}} }, { $group:{_id:null, total:{$sum:"$lc"}} }]),
      Blog.aggregate([{ $project:{cc:{$size:"$comments"}} }, { $group:{_id:null, total:{$sum:"$cc"}} }]),
      Blog.countDocuments({ isPublished:true }),
      Blog.countDocuments({ createdAt:{$gte:thisMonth} }),
      Message.countDocuments({ createdAt:{$gte:last30Days} }),
      Message.countDocuments({ read:false }),
    ]);

    const engagement = {
      totalBlogViews:     blogViewsResult[0]?.total    ?? 0,
      totalBlogLikes:     blogLikesResult[0]?.total    ?? 0,
      totalBlogComments:  blogCommentsResult[0]?.total ?? 0,
      publishedBlogs,
      newBlogsThisMonth,
      messagesLast30Days,
      unreadMessages,
    };

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 6 — Recent records & top performers (parallel)
    // ══════════════════════════════════════════════════════════════════════════
    const [
      recentRecruiters, recentJobSeekers,
      topJobsByApplications, quotaUtilization,
      topBlogsByViews,
    ] = await Promise.all([
      Employer.find({ role:"employer" })
        .select("name lastName email location plan status createdAt isConfirmed lifetimeJobOffersCreated jobOffersQuota")
        .sort({ createdAt:-1 }).limit(8),
      JobSeeker.find()
        .select("name lastName email specialization location createdAt isConfirmed isPremium")
        .sort({ createdAt:-1 }).limit(8),
      Application.aggregate([
        { $group: { _id:"$job", count:{$sum:1}, accepted:{$sum:{$cond:[{$eq:["$status","accepted"]},1,0]}} } },
        { $sort: { count:-1 } }, { $limit:7 },
        { $lookup:{ from:"jobs", localField:"_id", foreignField:"_id", as:"job" } },
        { $unwind:{ path:"$job", preserveNullAndEmptyArrays:true } },
        { $project:{ count:1, accepted:1, position:"$job.position", company:"$job.company", specialization:"$job.specialization" } },
      ]),
      Employer.aggregate([
        { $match: { role:"employer" } },
        {
          $project: {
            name:1, email:1, plan:1,
            jobOffersQuota:1, lifetimeJobOffersCreated:1,
            pct: { $cond:[
              { $gt:["$jobOffersQuota",0] },
              { $multiply:[{ $divide:["$lifetimeJobOffersCreated","$jobOffersQuota"] },100] },
              0,
            ]},
          },
        },
        { $sort:{ pct:-1 } }, { $limit:8 },
      ]),
      Blog.find({ isPublished:true })
        .select("title category viewCount createdAt")
        .sort({ viewCount:-1 }).limit(5),
    ]);

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 7 — Today's pulse
    // ══════════════════════════════════════════════════════════════════════════
    const [todayRec, todaySeek, todayJobs, todayApps, todayMessages] = await Promise.all([
      Employer.countDocuments({ role:"employer", createdAt:{$gte:today} }),
      JobSeeker.countDocuments({ createdAt:{$gte:today} }),
      Job.countDocuments({ createdAt:{$gte:today} }),
      Application.countDocuments({ createdAt:{$gte:today} }),
      Message.countDocuments({ createdAt:{$gte:today} }),
    ]);

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 8 — Financial projections (DZA)
    // ══════════════════════════════════════════════════════════════════════════
    const planCounts = planDistribution.reduce((acc, p) => { acc[p._id] = p.count; return acc; }, {});
    const trialCount = planCounts.trial || 0;
    const paidCount  = (planCounts.basic||0) + (planCounts.pro||0) + (planCounts.enterprise||0);

    const currentMRR = Object.entries(PLAN_PRICING_DZA).reduce((sum, [plan, price]) => {
      return sum + (planCounts[plan]||0) * price;
    }, 0);

    const revenueByPlan = Object.entries(PLAN_PRICING_DZA).map(([plan, price]) => ({
      plan,
      count: planCounts[plan] || 0,
      monthlyRevenue: (planCounts[plan]||0) * price,
      annualRevenue:  (planCounts[plan]||0) * price * 12,
    }));

    // 6-month projected MRR if 30% of trial users convert monthly
    const projectedMRR6Months = Array.from({ length:6 }, (_,i) => {
      const cumConvRate = Math.min(0.3 * (i+1), 1);
      const extraMRR    = trialCount * cumConvRate * PLAN_PRICING_DZA.basic;
      return {
        label: MONTHS[(new Date().getMonth() + i + 1) % 12],
        mrr: Math.round(currentMRR + extraMRR),
      };
    });

    const financials = {
      currentMRR,
      paidUsers:           paidCount,
      trialUsers:          trialCount,
      projectedMRR_30pct:  Math.round(currentMRR + trialCount * 0.30 * PLAN_PRICING_DZA.basic),
      projectedMRR_50pct:  Math.round(currentMRR + trialCount * 0.50 * PLAN_PRICING_DZA.basic),
      maxPotentialMRR:     Math.round(totalRecruiters * PLAN_PRICING_DZA.basic),
      revenueByPlan,
      projectedMRR6Months,
      pricingDZA: PLAN_PRICING_DZA,
      // Unit economics (estimates for investor deck)
      estimatedARPU:     paidCount > 0 ? Math.round(currentMRR / paidCount) : 0,
      estimatedLTV:      paidCount > 0 ? Math.round((currentMRR / paidCount) * 12) : 0, // 12-month LTV
      conversionRate:    totalRecruiters > 0 ? Math.round((paidCount / totalRecruiters) * 100) : 0,
    };

    // ══════════════════════════════════════════════════════════════════════════
    // LAYER 9 — Platform health scores
    // ══════════════════════════════════════════════════════════════════════════
    const activationRate       = totalUsers > 0
      ? Math.round(((confirmedRecruiters + confirmedSeekers) / totalUsers) * 100) : 0;
    const avgAppsPerJob        = totalJobs > 0
      ? Math.round((totalApplications / totalJobs) * 10) / 10 : 0;
    const acceptanceRate       = totalApplications > 0
      ? Math.round((funnelMap.accepted / totalApplications) * 100) : 0;
    const viewToApplyRate      = funnelMap.viewed > 0
      ? Math.round((funnelMap.applied / funnelMap.viewed) * 100) : 0;
    const seekerPremiumRate    = totalJobSeekers > 0
      ? Math.round((
          (await JobSeeker.countDocuments({ isPremium:true })) / totalJobSeekers
        ) * 100) : 0;

    const health = {
      activationRate,
      avgAppsPerJob,
      acceptanceRate,
      viewToApplyRate,
      seekerPremiumRate,
    };

    // ══════════════════════════════════════════════════════════════════════════
    // FINAL RESPONSE
    // ══════════════════════════════════════════════════════════════════════════
    res.status(StatusCodes.OK).json({
      kpis: {
        totalUsers, totalRecruiters, totalJobSeekers,
        totalJobs, totalApplications, totalBlogs, totalMessages,
        confirmedRecruiters, confirmedSeekers, pendingRecruiters, blockedRecruiters,
      },
      growth: {
        recruiters:   { thisMonth:recThisM,  lastMonth:recLastM,  pct:growthPct(recThisM,recLastM) },
        seekers:      { thisMonth:seekThisM, lastMonth:seekLastM, pct:growthPct(seekThisM,seekLastM) },
        jobs:         { thisMonth:jobThisM,  lastMonth:jobLastM,  pct:growthPct(jobThisM,jobLastM) },
        applications: { thisMonth:appThisM,  lastMonth:appLastM,  pct:growthPct(appThisM,appLastM) },
      },
      monthlyGrowth,
      dailyApplications,
      planDistribution,
      jobStatusBreakdown,
      jobTypeBreakdown,
      topSpecializations,
      topSeekerSpecializations,
      blogCategories,
      topLocations,
      applicationFunnel: funnelMap,
      compatibilityBuckets,
      engagement,
      financials,
      health,
      recentRecruiters,
      recentJobSeekers,
      topJobsByApplications,
      quotaUtilization,
      topBlogsByViews,
      today: {
        newRecruiters: todayRec, newJobSeekers: todaySeek,
        newJobs: todayJobs, newApplications: todayApps, newMessages: todayMessages,
      },
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("[AdminAnalytics]", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
