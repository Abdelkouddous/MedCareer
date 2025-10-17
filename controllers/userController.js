// UserController
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";
import JobSeekerModel from "../models/JobSeekerModel.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.user.userId;

  // Special handling for guest user
  if (userId === "123456789012345678901234" || req.user.role === "guest") {
    const guestUser = {
      _id: "123456789012345678901234",
      name: "Guest User",
      role: "guest",
      email: "guest@example.com",
      lastName: "User",
      location: "Guest Location",
      specialty: "General Practitioner",
      avatar: null,
    };

    return res
      .status(StatusCodes.OK)
      .json({ user: guestUser, msg: "Guest user data" });
  }

  try {
    // user not {user} cuz {user} will cause a conflict
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ user, msg: "Successfully got user data" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// getting stats necessary for admin dashboard stats
export const getApplicationStats = async (req, res) => {
  const userId = req.user.userId;
  try {
    const jobs = await Job.find({ createdBy: userId });
    const totalJobs = await Job.countDocuments();
    const appliedJobs = jobs.filter((job) => job.applied).length;
    const pendingJobs = totalJobs - appliedJobs;
    const totalUsers = await User.countDocuments();

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
export const getUserJobs = async (req, res) => {
  const userId = req.user.userId;
  try {
    const jobs = await Job.find({ createdBy: userId });
    if (!jobs) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No jobs found" });
    }
    res.status(StatusCodes.OK).json({ jobs });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

//gettnig all users
export const getAllUsers = async (req, res) => {
  try {
    // Find all users without any authentication requirement
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ users: [], message: "No users found" });
    }

    res.status(StatusCodes.OK).json({ users, count: users.length });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("=== Starting updateUser ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const newUser = { ...req.body };
    delete newUser.password;

    // Handle avatar upload to Cloudinary
    if (req.file) {
      console.log("File detected, processing upload...");

      try {
        // Check if file exists
        if (!req.file || !req.file.path) {
          throw new Error("File path not found");
        }

        console.log("Uploading file to Cloudinary...");
        const response = await cloudinary.v2.uploader.upload(req.file.path);
        console.log("Cloudinary upload response:", response);

        // Clean up local file
        await fs.unlink(req.file.path);
        console.log("Local file cleaned up");

        newUser.avatar = response.secure_url;
        newUser.avatarPublicId = response.public_id;

        console.log("Avatar successfully uploaded to Cloudinary");
        console.log("Avatar URL:", newUser.avatar);
        console.log("Avatar Public ID:", newUser.avatarPublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload image to Cloudinary",
          error: cloudinaryError.message,
        });
      }
    } else {
      newUser.avatar = null;
      newUser.avatarPublicId = null;
      console.log("No file uploaded, setting avatar to null");
    }

    console.log("About to update user in database...");
    console.log("User ID:", req.user.userId);
    console.log("User data to update:", newUser);

    // Update user in database
    const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser, {
      new: true,
    });

    console.log("Database update result:", updateUser);

    if (!updateUser) {
      console.error("User not found in database");
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    console.log("User updated successfully");

    // Return success response
    res.status(StatusCodes.OK).json({
      msg: "User updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.error("Unexpected error in updateUser:", error);
    console.error("Error stack:", error.stack);

    // Handle specific error types
    if (error.name === "ValidationError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation error",
        error: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid user ID format",
        error: error.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const validateUpdateUserInput = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }
  next();
};
export const validateDeleteUserInput = (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User ID is required" });
  }
  next();
};

export const deleteUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
// Limit access to the app status only to admin
export const authorizePermissions = (...rest) => {
  console.log(rest);
  return (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Access denied" });
    }
    next();
  };
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

    const user = await User.findByIdAndUpdate(
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

    const user = await User.findByIdAndUpdate(id, updateData, {
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
    const pendingUsers = await User.find({
      role: "user",
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

// getting all job seekers
export const getAllJobSeekers = async (req, res) => {
  try {
    // Find all users without any authentication requirement
    const jobSeekers = await JobSeekerModel.find({});

    if (!jobSeekers || jobSeekers.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ jobSeekers: [], message: "No job seekers found" });
    }

    res.status(StatusCodes.OK).json({ jobSeekers, count: jobSeekers.length });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
