// jobSeekerController.js
import { StatusCodes } from "http-status-codes";
import JobSeeker from "../models/JobSeekerModel.js";

import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import mongoose from "mongoose";

// Get all job seekers
// You can call it in frontend by using getAllJobSeekers.length to count all job seekers

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
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const jobSeeker = await JobSeeker.create({
      email,
      password: hashedPassword,
      isConfirmed: false, // NOT confirmed yet
      confirmOTP: otp, // temporary field
      otpExpires,
      ...otherFields,
    });
    // 👉 Send OTP via email (use Nodemailer, etc.)
    console.log(`[DEV] OTP for ${email}: ${otp}`); // For testing only
    const responseData = {
      message: "OTP sent to your email",
      userId: jobSeeker._id,
    };

    // 👇 ONLY in development: expose OTP for testing
    if (process.env.NODE_ENV === "development") {
      responseData.devOtp = otp; // Never do this in production!
    }

    res.status(201).json(responseData);
    const sanitized = jobSeeker.toObject();
    delete sanitized.password;

    // No token is provided at registration, user must login
    // res.status(StatusCodes.CREATED).json({
    //   jobSeeker: sanitized,
    //   message:
    //     "Registration successful. Please confirm your email with the OTP sent to your email.",
    // });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Confirm email
// POST /api/jobseekers/confirm-email
export const confirmEmail = async (req, res) => {
  const { userId, otp } = req.body; // Expect userId and otp from frontend

  if (!userId || !otp) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User ID and OTP are required" });
  }

  const jobSeeker = await JobSeeker.findById(userId).select(
    "+confirmOTP +otpExpires"
  );

  if (!jobSeeker) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  if (jobSeeker.isConfirmed) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Account already confirmed" });
  }

  // Check OTP and expiry
  if (jobSeeker.confirmOTP !== otp || jobSeeker.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // ✅ Valid OTP → confirm user
  jobSeeker.isConfirmed = true;
  jobSeeker.confirmOTP = undefined;
  jobSeeker.otpExpires = undefined;
  await jobSeeker.save();
  // Generate JWT token for user
  const token = createJWT({ userId: jobSeeker._id });
  res.status(StatusCodes.OK).json({ message: "Email confirmed successfully" });
};

// Resend OTP
// POST /api/jobseekers/resend-otp
export const resendOtp = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User ID is required" });
  }

  const jobSeeker = await JobSeeker.findById(userId).select(
    "+confirmOTP +otpExpires"
  );

  if (!jobSeeker) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  if (jobSeeker.isConfirmed) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Account already confirmed" });
  }

  // Generate and save new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  jobSeeker.confirmOTP = otp;
  jobSeeker.otpExpires = otpExpires;
  await jobSeeker.save();

  // Send OTP via email (placeholder: log in dev)
  console.log(`[DEV] Resent OTP for ${jobSeeker.email}: ${otp}`);

  const responseData = { message: "OTP resent successfully" };
  if (process.env.NODE_ENV === "development") {
    responseData.devOtp = otp; // Only for development/testing
  }

  res.status(StatusCodes.OK).json(responseData);
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

    // Require email confirmation before allowing login
    if (!jobSeeker.isConfirmed) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Please confirm your email to continue",
        userId: jobSeeker._id,
      });
    }

    const isMatch = await comparePassword(password, jobSeeker.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const token = createJWT({ jobSeekerId: jobSeeker._id });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

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
