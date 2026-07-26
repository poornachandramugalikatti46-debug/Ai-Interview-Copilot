/**
 * backend/middleware/errorMiddleware.js
 * Global Error Handling Middleware
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // ==========================
  // Mongoose Invalid ObjectId
  // ==========================
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // ==========================
  // Mongoose Validation Error
  // ==========================
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ==========================
  // Mongo Duplicate Key Error
  // ==========================
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  // ==========================
  // JWT Errors
  // ==========================
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  // ==========================
  // Judge0 / External API Errors
  // ==========================
  if (err.response?.data?.message) {
    message = err.response.data.message;
  }

  // ==========================
  // Final Response
  // ==========================
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

export {
  notFound,
  errorHandler,
};