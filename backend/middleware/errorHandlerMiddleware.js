import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; //500 error
  const msg = err.message || "Something went wrong, please try again later.";
  res.status(statusCode).json({ msg });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};

export default errorHandlerMiddleware;
// This middleware is executed after all other middleware functions
