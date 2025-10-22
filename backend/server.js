import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import agentAuthRoutes from './routes/agentAuthRoutes.js';
import subAgentRoutes from './routes/subAgentRoutes.js';
import agentTaskRoutes from './routes/agentTaskRoutes.js';
import agentUploadRoutes from './routes/agentUploadRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/agent-auth', agentAuthRoutes);
app.use('/api/sub-agents', subAgentRoutes);
app.use('/api/agent-tasks', agentTaskRoutes);
app.use('/api/agent-upload', agentUploadRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Agent Management API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});