// jobSeekerController.js
import { StatusCodes } from "http-status-codes";
import JobSeeker from "../models/JobSeekerModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import mongoose from "mongoose";

// Get all job seekers
export const getAllJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.find().select("-password");
    res.status(StatusCodes.OK).json(jobSeekers);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Get job seeker by ID
export const getJobSeekerById = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id).select(
      "-password"
    );
    if (!jobSeeker) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job seeker not found" });
    }
    res.status(StatusCodes.OK).json(jobSeeker);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Create new job seeker
export const createJobSeeker = async (req, res) => {
  try {
    const { email, password, ...otherFields } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" });
    }

    const existing = await JobSeeker.findOne({ email });
    if (existing) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Job seeker already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const jobSeeker = await JobSeeker.create({
      email,
      password: hashedPassword,
      ...otherFields,
    });

    const token = createJWT({ jobSeekerId: jobSeeker._id, role: "jobseeker" });

    const sanitized = jobSeeker.toObject();
    delete sanitized.password;

    res.status(StatusCodes.CREATED).json({ jobSeeker: sanitized, token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Update job seeker
export const updateJobSeeker = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id);
    if (!jobSeeker) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job seeker not found" });
    }

    const updates = { ...req.body, updatedAt: new Date() };
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    const updated = await JobSeeker.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Delete job seeker
export const deleteJobSeeker = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id);
    if (!jobSeeker) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job seeker not found" });
    }

    await JobSeeker.findByIdAndDelete(req.params.id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Job seeker deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Job seeker login
export const loginJobSeeker = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" });
    }

    const jobSeeker = await JobSeeker.findOne({ email });
    if (!jobSeeker) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, jobSeeker.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const token = createJWT({ jobSeekerId: jobSeeker._id, role: "jobseeker" });

    const sanitized = jobSeeker.toObject();
    delete sanitized.password;

    res.status(StatusCodes.OK).json({ jobSeeker: sanitized, token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Guest job seeker
// (issue a guest token and set httpOnly cookie)
export const guestJobSeeker = async (req, res) => {
  try {
    // Include userId to avoid breaking any shared middleware that expects it
    const token = createJWT({
      userId: "guest_jobseeker",
      jobSeekerId: "guest",
      role: "jobseeker_guest",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      sameSite: "strict",
    });

    const guest = {
      _id: "guest",
      name: "Guest",
      lastName: "JobSeeker",
      role: "jobseeker_guest",
      email: "guest.jobseeker@example.com",
      location: "N/A",
      profilePicture: null,
      curriculumVitae: null,
    };

    res.status(StatusCodes.OK).json({
      msg: "Welcome, guest job seeker!",
      jobSeeker: guest,
      token,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getCurrentJobSeeker = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    if (!mongoose.isValidObjectId(jobSeekerId)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authentication invalid" });
    }
    const jobSeeker = await JobSeeker.findById(jobSeekerId).select("-password");
    if (!jobSeeker) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job seeker not found" });
    }
    res.status(StatusCodes.OK).json({ jobSeeker });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateCurrentJobSeeker = async (req, res) => {
  try {
    const jobSeekerId = req.jobSeeker?.jobSeekerId;
    if (!mongoose.isValidObjectId(jobSeekerId)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authentication invalid" });
    }

    const updates = { ...req.body, updatedAt: new Date() };

    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Only allow safe fields to be updated
    const allowed = [
      "name",
      "lastName",
      "email",
      "password",
      "location",
      "phoneNumber",
      "profilePicture",
      "curriculumVitae",
    ];
    Object.keys(updates).forEach((k) => {
      if (!allowed.includes(k)) delete updates[k];
    });

    const updated = await JobSeeker.findByIdAndUpdate(
      jobSeekerId,
      { $set: updates },
      { new: true }
    ).select("-password");
    if (!updated) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job seeker not found" });
    }
    res.status(StatusCodes.OK).json({ jobSeeker: updated });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Job seeker logout
export const logoutJobSeeker = (req, res) => {
  try {
    // Clear the token cookie by setting it to expire immediately
    res.cookie("token", "logout", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now()),
      sameSite: "strict",
    });

    res.status(StatusCodes.OK).json({
      msg: "Successfully logged out!",
      success: true,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
