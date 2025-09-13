import { Unauthenticated } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

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
    req.user = { userId: 'guest', role: 'guest' };
    return next();
  }
  
  try {
    const { userId, role } = verifyJWT(req.cookies.token);
    req.user = { userId, role };
    next();
  } catch (error) {
    // If token verification fails, set as guest
    req.user = { userId: 'guest', role: 'guest' };
    next();
  }
};
