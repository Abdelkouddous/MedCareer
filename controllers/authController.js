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
  // Initialize employer accounts as pending with trial quotas
  if (role === "user") {
    req.body.status = "pending";
    req.body.plan = "trial";
    req.body.jobOffersQuota = 3;
    req.body.lifetimeJobOffersCreated = 0;
  }

  /******  963f48b7-65da-4ecb-a302-c748a799047a  *******/
  try {
    // const salt = await bcrypt.genSalt(10);
    // // req.body.password = await bcrypt.hash(req.body.password, salt);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // req.body.password = hashedPassword;
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);

    // const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
      user: {
        name: user.name,
        userId: user._id,
        status: user.status,
        plan: user.plan,
        jobOffersQuota: user.jobOffersQuota,
        lifetimeJobOffersCreated: user.lifetimeJobOffersCreated,
      },
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

    const user = await User.findOne({ email }).select("+password");

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
