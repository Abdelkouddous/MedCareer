// inside authMiddleware.js
import { verifyJWT } from "../utils/tokenUtils.js";

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
