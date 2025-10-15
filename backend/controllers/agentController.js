import Agent from '../models/Agent.js';
import {
  validateEmail,
  validateMobile,
  validatePassword,
} from '../utils/validators.js';

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private
export const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, password',
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate mobile
    if (!validateMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide a valid mobile number with country code (e.g., +911234567890)',
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if agent already exists
    const agentExists = await Agent.findOne({
      $or: [{ email }, { mobile }],
    });

    if (agentExists) {
      const field = agentExists.email === email ? 'email' : 'mobile number';
      return res.status(409).json({
        success: false,
        message: `Agent with this ${field} already exists`,
      });
    }

    // Create agent
    const agent = await Agent.create({
      name,
      email,
      mobile,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      data: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        createdAt: agent.createdAt,
      },
    });
  } catch (error) {
    console.error('Create agent error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Agent with this ${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating agent',
    });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching agents',
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    await agent.deleteOne();

    res.json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting agent',
    });
  }
};