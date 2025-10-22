import express from 'express';
import { uploadFile, upload } from '../controllers/agentUploadController.js';
import { protectAgent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protectAgent, upload.single('file'), uploadFile);

export default router;