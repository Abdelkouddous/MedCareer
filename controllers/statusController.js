import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const getStatus = async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date(),
    service: "MedCareer API",
    database: dbStatus,
  });
};
