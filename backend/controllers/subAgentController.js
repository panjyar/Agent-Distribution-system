import Agent from '../models/Agent.js';
import {
  validateEmail,
  validateMobile,
  validatePassword,
} from '../utils/validators.js';

// @desc    Create new sub-agent
// @route   POST /api/sub-agents
// @access  Private (Agent)
export const createSubAgent = async (req, res) => {
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

    // Check if sub-agent already exists
    const subAgentExists = await Agent.findOne({
      $or: [{ email }, { mobile }],
    });

    if (subAgentExists) {
      const field = subAgentExists.email === email ? 'email' : 'mobile number';
      return res.status(409).json({
        success: false,
        message: `Sub-agent with this ${field} already exists`,
      });
    }

    // Create sub-agent
    const subAgent = await Agent.create({
      name,
      email,
      mobile,
      password,
      createdBy: req.agent._id,
      createdByModel: 'Agent',
      parentAgent: req.agent._id,
    });

    res.status(201).json({
      success: true,
      message: 'Sub-agent created successfully',
      data: {
        _id: subAgent._id,
        name: subAgent.name,
        email: subAgent.email,
        mobile: subAgent.mobile,
        createdAt: subAgent.createdAt,
      },
    });
  } catch (error) {
    console.error('Create sub-agent error:', error);
    
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
        message: `Sub-agent with this ${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating sub-agent',
    });
  }
};

// @desc    Get all sub-agents created by current agent
// @route   GET /api/sub-agents
// @access  Private (Agent)
export const getSubAgents = async (req, res) => {
  try {
    const subAgents = await Agent.find({ 
      parentAgent: req.agent._id 
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subAgents.length,
      data: subAgents,
    });
  } catch (error) {
    console.error('Get sub-agents error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching sub-agents',
    });
  }
};

// @desc    Delete sub-agent
// @route   DELETE /api/sub-agents/:id
// @access  Private (Agent)
export const deleteSubAgent = async (req, res) => {
  try {
    const subAgent = await Agent.findOne({
      _id: req.params.id,
      parentAgent: req.agent._id
    });

    if (!subAgent) {
      return res.status(404).json({
        success: false,
        message: 'Sub-agent not found or you do not have permission to delete this sub-agent',
      });
    }

    await subAgent.deleteOne();

    res.json({
      success: true,
      message: 'Sub-agent deleted successfully',
    });
  } catch (error) {
    console.error('Delete sub-agent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting sub-agent',
    });
  }
};
