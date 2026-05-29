/**
 * Get API Status/Health Check
 * @route   GET /api/status
 * @access  Public
 */
export const getStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vibevilaa API server is fully operational',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    environment: process.env.NODE_ENV || 'development'
  });
};

/**
 * Get Welcome Message
 * @route   GET /api
 * @access  Public
 */
export const getWelcome = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Vibevilaa API',
    version: '1.0.0',
    endpoints: {
      healthCheck: '/api/status'
    }
  });
};
