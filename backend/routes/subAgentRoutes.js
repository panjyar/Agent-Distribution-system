import express from 'express';
import {
  createSubAgent,
  getSubAgents,
  deleteSubAgent,
} from '../controllers/subAgentController.js';
import { protectAgent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protectAgent, createSubAgent).get(protectAgent, getSubAgents);
router.route('/:id').delete(protectAgent, deleteSubAgent);

export default router;