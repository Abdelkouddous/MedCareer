// inside authMiddleware.js
import { verifyJWT } from "../utils/tokenUtils.js";
import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { Unauthenticated } from "../errors/customErrors.js";

// Job seeker authentication middleware
export const authenticateJobSeeker = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const token = req.signedCookies?.token || req.cookies?.token || tokenFromHeader;

    // Check if token exists and is not the logout placeholder
    if (!token || token === "logout") {
      return res.status(401).json({ 
        message: "Authentication invalid - Please log in again",
        requiresLogin: true 
      });
    }

    const payload = verifyJWT(token);
    if (!payload?.jobSeekerId) {
      return res.status(401).json({ 
        message: "Authentication invalid - Invalid token",
        requiresLogin: true 
      });
    }

    req.jobSeeker = {
      jobSeekerId: payload.jobSeekerId,
      role: payload.role || "jobseeker",
    };
    next();
  } catch (error) {
    // Clear invalid token cookie
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    
    return res.status(401).json({ 
      message: "Authentication invalid - Token expired or invalid",
      requiresLogin: true 
    });
  }
};
export const authenticateUser = (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) {
    throw new Unauthenticated("Authentication invalid");
  }
  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    //we put next so we dont get stuck on this middleware
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication invalid");
  }
};

// Middleware to check if user has permission to edit or post jobs
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthenticated("Not authorized to access this route");
    }
    next();
  };
};

// Middleware to allow guest access for viewing jobs only
export const allowGuestForViewing = (req, res, next) => {
  // If no token or invalid token, set as guest
  if (!req.cookies.token) {
    req.user = { userId: "guest", role: "guest" };
    return next();
  }

  try {
    const { userId, role } = verifyJWT(req.cookies.token);
    req.user = { userId, role };
    next();
  } catch (error) {
    // If token verification fails, set as guest
    req.user = { userId: "guest", role: "guest" };
    next();
  }
};

// Ensure employer (user role) is approved before posting jobs
export const ensureEmployerApproved = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }
    const user = await User.findById(userId).select("status role");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    if (user.role !== "admin" && user.status !== "approved") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Employer account not approved. Please wait for admin confirmation." });
    }
    next();
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// Enforce employer quota: block when lifetime creations reached quota
export const enforceEmployerQuota = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }
    const user = await User.findById(userId).select(
      "role lifetimeJobOffersCreated jobOffersQuota status"
    );
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    // Admin bypass
    if (user.role === "admin") return next();

    if (user.status !== "approved") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Employer account not approved. Please wait for admin confirmation." });
    }

    if (user.lifetimeJobOffersCreated >= user.jobOffersQuota) {
      return res.status(StatusCodes.PAYMENT_REQUIRED).json({
        message: "Free trial quota reached. Please upgrade to post more job offers.",
        quota: {
          lifetimeJobOffersCreated: user.lifetimeJobOffersCreated,
          jobOffersQuota: user.jobOffersQuota,
        },
      });
    }
    next();
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};
