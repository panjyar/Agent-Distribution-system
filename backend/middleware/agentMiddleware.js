import jwt from 'jsonwebtoken';
import Agent from '../models/Agent.js';

export const protectAgent = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's an agent token
      if (decoded.type !== 'agent') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token type',
        });
      }

      // Get agent from token
      req.agent = await Agent.findById(decoded.id).select('-password');

      if (!req.agent) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, agent not found',
        });
      }

      next();
    } catch (error) {
      console.error('Agent auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};