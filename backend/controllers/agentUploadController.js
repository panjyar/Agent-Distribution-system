import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import DistributedData from '../models/DistributedData.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// @desc    Upload CSV file and distribute to sub-agents
// @route   POST /api/agent-upload
// @access  Private (Agent)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file',
      });
    }

    const filePath = req.file.path;
    const results = [];

    // Read and parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          if (results.length === 0) {
            // Clean up file
            fs.unlinkSync(filePath);
            return res.status(400).json({
              success: false,
              message: 'CSV file is empty',
            });
          }

          // Get all sub-agents created by current agent
          const Agent = (await import('../models/Agent.js')).default;
          const subAgents = await Agent.find({ 
            parentAgent: req.agent._id 
          }).select('_id name email');

          if (subAgents.length === 0) {
            // Clean up file
            fs.unlinkSync(filePath);
            return res.status(400).json({
              success: false,
              message: 'No sub-agents found. Please create sub-agents first.',
            });
          }

          // Distribute data among sub-agents
          const distributedData = [];
          const dataPerAgent = Math.ceil(results.length / subAgents.length);

          for (let i = 0; i < subAgents.length; i++) {
            const startIndex = i * dataPerAgent;
            const endIndex = Math.min(startIndex + dataPerAgent, results.length);
            const agentData = results.slice(startIndex, endIndex);

            for (const data of agentData) {
              const distributedRecord = {
                agentId: subAgents[i]._id,
                agentName: subAgents[i].name,
                agentEmail: subAgents[i].email,
                firstName: data.firstName || data.name || 'N/A',
                phone: data.phone || data.mobile || data.contact || 'N/A',
                notes: data.notes || data.comments || '',
                distributedBy: req.agent._id,
                distributedByModel: 'Agent',
                distributedByEmail: req.agent.email,
              };
              distributedData.push(distributedRecord);
            }
          }

          // Save distributed data to database
          await DistributedData.insertMany(distributedData);

          // Clean up file
          fs.unlinkSync(filePath);

          res.json({
            success: true,
            message: `File uploaded and distributed successfully. ${results.length} records distributed among ${subAgents.length} sub-agents.`,
            data: {
              totalRecords: results.length,
              subAgentsCount: subAgents.length,
              distributedRecords: distributedData.length,
            },
          });
        } catch (error) {
          console.error('File processing error:', error);
          // Clean up file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          res.status(500).json({
            success: false,
            message: 'Error processing file: ' + error.message,
          });
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        // Clean up file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(500).json({
          success: false,
          message: 'Error parsing CSV file: ' + error.message,
        });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during file upload',
    });
  }
};
