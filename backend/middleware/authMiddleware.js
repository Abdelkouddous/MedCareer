// inside authMiddleware.js
import { verifyJWT } from "../utils/tokenUtils.js";
import Employer from "../models/EmployerModel.js";
import JobSeeker from "../models/JobSeekerModel.js";
import { StatusCodes } from "http-status-codes";
import { Unauthenticated, UnauthorizedError, ServerError } from "../errors/customErrors.js";

// Job seeker authentication middleware
export const authenticateJobSeeker = async (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) {
    throw new Unauthenticated("Authentication invalid");
  }
  try {
    const { jobSeekerId } = verifyJWT(token);
    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
      throw new Unauthenticated("Job seeker not found");
    }
    req.jobSeeker = { jobSeekerId };
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication invalid");
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
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError("Not authorized to access this route");
    }
    next();
  };
};


/**
 * Platform Owner Guard — the CEO admin middleware.
 *
 * Computer Science concept: This implements a TWO-FACTOR authorization check:
 *   Factor 1 → JWT role claim must equal "admin"  (stateless, cryptographic)
 *   Factor 2 → The user's DB email must equal ADMIN_EMAIL env var (stateful, config-driven)
 *
 * Why two factors?
 * A JWT role alone can be forged if the secret leaks.
 * An email match against an env var ensures the identity is baked into
 * the deployment config — a separate trust boundary from the database.
 * No database write can ever grant CEO-level access.
 */
export const authenticatePlatformOwner = async (req, res, next) => {
  // Factor 1: JWT must carry role=admin
  if (req.user?.role !== "admin") {
    throw new UnauthorizedError(
      "Access denied — CEO dashboard is restricted to the platform owner."
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("[Security] ADMIN_EMAIL env variable is not set!");
    throw new ServerError(
      "Server misconfiguration — contact the platform owner."
    );
  }

  try {
    // Factor 2: Fetch the user record and compare email against env config
    const user = await Employer.findById(req.user.userId).select("email role");
    if (!user) {
      throw new Unauthenticated("User not found");
    }

    if (user.email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      // Log the attempt — this is a potential security incident
      console.warn(
        `[Security] Unauthorized CEO dashboard access attempt by: ${user.email} (userId: ${req.user.userId})`
      );
      throw new UnauthorizedError(
        "Access denied — you are not the platform owner."
      );
    }

    // Attach the verified owner identity to the request
    req.platformOwner = { userId: user._id, email: user.email };
    next();
  } catch (err) {
    if (
      err instanceof UnauthorizedError ||
      err instanceof Unauthenticated ||
      err instanceof ServerError
    ) {
      throw err;
    }
    throw new ServerError("Server error");
  }
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
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authentication required" });
    }
    const user = await Employer.findById(userId).select("status role");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    // Platform owner bypass — the CEO is never subject to approval workflows
    const isOwner = process.env.ADMIN_EMAIL &&
      user.email?.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim();

    if (!isOwner && user.status !== "approved") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Employer account not approved. Please wait for admin confirmation.",
      });
    }
    next();
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Enforce employer quota: block when lifetime creations reached quota
export const enforceEmployerQuota = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authentication required" });
    }
    const user = await Employer.findById(userId).select(
      "role lifetimeJobOffersCreated jobOffersQuota status"
    );
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    // Platform owner bypass — CEO is never quota-gated
    const isOwner = process.env.ADMIN_EMAIL &&
      user.email?.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim();
    if (isOwner) return next();

    if (user.status !== "approved") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message:
          "Employer account not approved. Please wait for admin confirmation.",
      });
    }

    if (user.lifetimeJobOffersCreated >= user.jobOffersQuota) {
      return res.status(StatusCodes.PAYMENT_REQUIRED).json({
        message:
          "Free trial quota reached. Please upgrade to post more job offers.",
        quota: {
          lifetimeJobOffersCreated: user.lifetimeJobOffersCreated,
          jobOffersQuota: user.jobOffersQuota,
        },
      });
    }
    next();
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
