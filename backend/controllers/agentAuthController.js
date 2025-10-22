import Agent from '../models/Agent.js';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword } from '../utils/validators.js';

// Generate JWT Token for Agent
const generateAgentToken = (id) => {
  return jwt.sign({ id, type: 'agent' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login agent
// @route   POST /api/agent-auth/login
// @access  Public
export const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for agent
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await agent.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        createdByModel: agent.createdByModel,
        parentAgent: agent.parentAgent,
        token: generateAgentToken(agent._id),
      },
    });
  } catch (error) {
    console.error('Agent login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get agent profile
// @route   GET /api/agent-auth/profile
// @access  Private (Agent)
export const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent._id).select('-password');
    
    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error('Get agent profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching profile',
    });
  }
};