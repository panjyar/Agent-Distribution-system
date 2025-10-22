import DistributedData from '../models/DistributedData.js';

// @desc    Get tasks assigned to current agent
// @route   GET /api/agent-tasks
// @access  Private (Agent)
export const getAgentTasks = async (req, res) => {
  try {
    // Get tasks assigned TO this agent by admin (not tasks distributed BY this agent)
    const tasks = await DistributedData.find({ 
      agentId: req.agent._id,
      distributedByModel: 'Admin' // Only tasks distributed by admin
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get agent tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching agent tasks',
    });
  }
};

// @desc    Get distributed data for current agent
// @route   GET /api/agent-tasks/distributed
// @access  Private (Agent)
export const getAgentDistributedData = async (req, res) => {
  try {
    // Get tasks distributed BY this agent to sub-agents
    const distributedData = await DistributedData.find({ 
      distributedBy: req.agent._id,
      distributedByModel: 'Agent'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: distributedData.length,
      data: distributedData,
    });
  } catch (error) {
    console.error('Get agent distributed data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching distributed data',
    });
  }
};
