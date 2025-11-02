const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Get status code from response or error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific error types
  let message = err.message;

  // MongoDB/Mongoose errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Firebase errors (additional handling)
  if (err.message.includes('Firebase') || err.message.includes('Token')) {
    // Keep the status code set by auth middleware
    statusCode = res.statusCode || 401;
  }

  // Development vs Production response
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.name,
      statusCode
    })
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error ${statusCode}:`, {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Log serious errors in production (5xx errors)
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    console.error('Server Error:', {
      message: err.message,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  res.status(statusCode).json(errorResponse);
};

export { notFound, errorHandler };