import express from 'express';
import {
  getAgentTasks,
  getAgentDistributedData,
} from '../controllers/agentTaskController.js';
import { protectAgent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protectAgent, getAgentTasks);
router.route('/distributed').get(protectAgent, getAgentDistributedData);

export default router;