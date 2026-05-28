import { StatusCodes } from "http-status-codes";
import Employer from "../models/EmployerModel.js";
import Job from "../models/JobModel.js";




// getting stats necessary for admin dashboard stats
export const getApplicationStats = async (req, res) => {
  const userId = req.user.userId;
  try {
    const jobs = await Job.find({ createdBy: userId });
    const totalJobs = await Job.countDocuments();
    const appliedJobs = jobs.filter((job) => job.applied).length;
    const pendingJobs = totalJobs - appliedJobs;
    const totalUsers = await Employer.countDocuments();

    res.status(StatusCodes.OK).json({
      totalJobs,
      appliedJobs,
      pendingJobs,
      totalUsers,
      msg: "Successfully got application stats",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Admin: Approve or block employers
export const updateEmployerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["approved", "pending", "blocked"];
    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid status. Must be approved, pending, or blocked",
      });
    }

    const user = await Employer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Employer not found" });
    }

    res.status(StatusCodes.OK).json({
      msg: `Employer status updated to ${status}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Admin: Update employer quotas
export const updateEmployerQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobOffersQuota, plan, quotaExpiresAt } = req.body;

    if (jobOffersQuota && jobOffersQuota < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Quota cannot be negative",
      });
    }

    const updateData = {};
    if (jobOffersQuota !== undefined)
      updateData.jobOffersQuota = jobOffersQuota;
    if (plan) updateData.plan = plan;
    if (quotaExpiresAt) updateData.quotaExpiresAt = quotaExpiresAt;

    const user = await Employer.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Employer not found" });
    }

    res.status(StatusCodes.OK).json({
      msg: "Employer quota updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// List pending employers for admin review
export const getPendingEmployers = async (req, res) => {
  try {
    const pendingUsers = await Employer.find({
      role: "employer",
      status: "pending",
    }).select("-password");

    res.status(StatusCodes.OK).json({
      users: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
