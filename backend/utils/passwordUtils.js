import bcrypt from "bcryptjs";

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
//generate JWT token
// import jwt from "jsonwebtoken";

// export const generateToken = async (user) => {
//   const payload = {
//     id: user._id,
//     role: user.role,
//   };
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
//   return token;
// };
