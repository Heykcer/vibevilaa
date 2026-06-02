/**
 * Central Error Handling Middleware for Express Application.
 * Intercepts all next(error) calls and returns standard JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  // Check if headers have already been sent to client
  if (res.headersSent) {
    return next(err);
  }

  // Deduce status code: default to 500 if none is set or if invalid
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;

  const responsePayload = {
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development mode for security reasons
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(responsePayload);
};

/**
 * Route Not Found Middleware (404 catch-all helper).
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
