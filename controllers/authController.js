// Description: Handles user authentication
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import { Unauthenticated } from "../errors/customErrors.js";

export const register = async (req, res, next) => {
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  req.body.role = role;

  /******  963f48b7-65da-4ecb-a302-c748a799047a  *******/
  try {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);

    // Generate OTP for email confirmation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmOTP = otp;
    user.otpExpires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
    await user.save();

    res.status(StatusCodes.CREATED).json({
      msg: `User registered successfully. 
      OTP ${otp}`,
      user: {
        name: user.name,
        userId: user._id,
      },
      // Return OTP in dev to simplify testing
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// /api/auth/login function

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      throw new Unauthenticated("Please provide all values");
    }

    const user = await User.findOne({ email }).select(
      "+password +confirmOTP +otpExpires"
    );

    if (!user) {
      throw new Unauthenticated("Invalid credentials");
    }

    const isPasswordCorrect = await comparePassword(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Unauthenticated("Invalid credentials");
    }

    // Require OTP confirmation before granting access
    if (!user.isConfirmed) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "Please confirm your email to continue",
        userId: user._id,
      });
    }

    const token = createJWT({ userId: user._id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    // Remove password from response
    user.password = undefined;

    res.status(StatusCodes.OK).json({ msg: "Logged in!", user, token });
  } catch (error) {
    next(error);
  }
};

// Verify OTP for employer/admin user
export const confirmEmailUser = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User ID and OTP are required" });
    }

    const user = await User.findById(userId).select("+confirmOTP +otpExpires");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    if (user.isConfirmed) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Account already confirmed" });
    }

    if (user.confirmOTP !== otp || user.otpExpires < Date.now()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or expired OTP" });
    }

    user.isConfirmed = true;
    user.confirmOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Optionally issue a token immediately after confirmation
    const token = createJWT({ userId: user._id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res
      .status(StatusCodes.OK)
      .json({ msg: "Email confirmed successfully", token });
  } catch (error) {
    next(error);
  }
};

// Resend OTP for employer/admin user
export const resendOtpUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User ID is required" });
    }
    const user = await User.findById(userId).select("+confirmOTP +otpExpires");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }
    if (user.isConfirmed) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Account already confirmed" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmOTP = otp;
    user.otpExpires = new Date(Date.now() + 1000 * 60 * 10);
    await user.save();

    res.status(StatusCodes.OK).json({
      msg: `Your OTP ${otp}`,
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// logout
export const logout = (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Successfully logged out !" });
};

// Guest login function
export const guestLogin = async (req, res, next) => {
  try {
    // Create a guest user token with limited permissions
    const token = createJWT({
      userId: "123456789012345678901234",
      role: "guest",
    });

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Guest sessions last only 24 hours
    });

    // Create a guest user object to return
    const guestUser = {
      _id: "123456789012345678901234",
      name: "Guest",
      role: "guest",
      email: "guest@example.com",
      lastName: "User",
      location: "Algeria",
      specialty: "General Practitioner",
      avatar: null,
    };

    res.status(StatusCodes.OK).json({
      msg: "Welcome guest!",
      user: guestUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};
