import { StatusCodes } from "http-status-codes";
import Application from "../models/ApplicationModel.js";
import Notification from "../models/NotificationModel.js";
import Job from "../models/JobModel.js";
import mongoose from "mongoose";

// deterministic placeholder score: stable per (job, jobSeeker)
const calcCompatibility = (jobId, jobSeekerId) => {
  const str = `${jobId}${jobSeekerId}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }
  return hash % 101; // 0..100
};

export const applyToJob = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    const role = req.jobSeeker?.role;
    const { jobId } = req.params;

    // Block guests or invalid ids from applying
    if (role === "jobseeker_guest" || !mongoose.isValidObjectId(jobSeekerId)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please login as a job seeker to apply" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
    }

    // Avoid duplicates: if already applied, return existing without creating another notification
    const existing = await Application.findOne({ job: jobId, jobSeeker: jobSeekerId }).populate("job");
    if (existing) {
      return res.status(StatusCodes.OK).json({ application: existing, alreadyApplied: true });
    }

    const score = calcCompatibility(jobId, jobSeekerId);

    const application = await Application.create({
      job: jobId,
      jobSeeker: jobSeekerId,
      status: "applied",
      compatibilityScore: score,
    });

    // Create a single 'applied' notification
    await Notification.create({
      recipientJobSeeker: jobSeekerId,
      type: "applied",
      message: `Application submitted for ${job.position} at ${job.company}`,
    });

    res.status(StatusCodes.CREATED).json({ application: await application.populate("job") });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    const role = req.jobSeeker?.role;

    // Guests or invalid ids get empty list instead of 500
    if (role === "jobseeker_guest" || !mongoose.isValidObjectId(jobSeekerId)) {
      return res.status(StatusCodes.OK).json({ applications: [] });
    }

    const applications = await Application.find({ jobSeeker: jobSeekerId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ applications });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getMyStats = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    const role = req.jobSeeker?.role;

    // Guests or invalid ids get zeroed stats instead of 500
    if (role === "jobseeker_guest" || !mongoose.isValidObjectId(jobSeekerId)) {
      return res.status(StatusCodes.OK).json({
        counts: { applied: 0, viewed: 0, accepted: 0, rejected: 0 },
        total: 0,
        avgCompatibility: 0,
      });
    }

    const apps = await Application.find({ jobSeeker: jobSeekerId });

    const counts = { applied: 0, viewed: 0, accepted: 0, rejected: 0 };
    let avgCompatibility = 0;
    if (apps.length > 0) {
      for (const a of apps) {
        counts[a.status] = (counts[a.status] || 0) + 1;
        avgCompatibility += a.compatibilityScore || 0;
      }
      avgCompatibility = Math.round(avgCompatibility / apps.length);
    }

    res.status(StatusCodes.OK).json({
      counts,
      total: apps.length,
      avgCompatibility,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const listNotifications = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    const role = req.jobSeeker?.role;

    if (role === "jobseeker_guest" || !mongoose.isValidObjectId(jobSeekerId)) {
      return res.status(StatusCodes.OK).json({ notifications: [] });
    }

    // Unique notifications for this job seeker (group by type+message, take latest)
    const oId = new mongoose.Types.ObjectId(jobSeekerId);
    const notifications = await Notification.aggregate([
      { $match: { recipientJobSeeker: oId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { type: "$type", message: "$message" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ]);

    res.status(StatusCodes.OK).json({ notifications });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    const role = req.jobSeeker?.role;
    const { id } = req.params;

    if (role === "jobseeker_guest" || !mongoose.isValidObjectId(jobSeekerId)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please login as a job seeker" });
    }

    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipientJobSeeker: jobSeekerId },
      { read: true },
      { new: true }
    );
    if (!notif) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Notification not found" });
    }
    res.status(StatusCodes.OK).json({ notification: notif });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
