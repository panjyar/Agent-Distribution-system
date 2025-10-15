import Agent from '../models/Agent.js';
import DistributedData from '../models/DistributedData.js';
import csv from 'csv-parser';
import fs from 'fs';
import XLSX from 'xlsx';
import { validateCSVHeaders } from '../utils/validators.js';

// @desc    Upload and distribute file
// @route   POST /api/upload
// @access  Private
export const uploadAndDistribute = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Get all agents
    const agents = await Agent.find().select('_id name email');

    if (agents.length === 0) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please create agents first before uploading data',
      });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.toLowerCase().split('.').pop();
    let data = [];

    try {
      // Parse file based on extension
      if (fileExtension === 'csv') {
        data = await parseCSV(filePath);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        data = await parseExcel(filePath);
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          message: 'Invalid file format. Only CSV, XLS, and XLSX are allowed',
        });
      }

      // Validate data
      if (data.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          message: 'File is empty or contains no valid data',
        });
      }

      // Validate headers
      const headers = Object.keys(data[0]);
      const headerValidation = validateCSVHeaders(headers);
      if (!headerValidation.valid) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          message: headerValidation.message,
        });
      }

      // Distribute data among agents
      const distributedRecords = distributeData(data, agents);

      // Save to database
      await DistributedData.insertMany(distributedRecords);

      // Delete uploaded file after processing
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: `Successfully distributed ${data.length} records among ${agents.length} agents`,
        data: {
          totalRecords: data.length,
          totalAgents: agents.length,
          recordsPerAgent: Math.floor(data.length / agents.length),
          remainderRecords: data.length % agents.length,
        },
      });
    } catch (parseError) {
      // Delete file on parsing error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw parseError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'File parsing failed',
    });
  }
};

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Normalize headers (trim whitespace, lowercase)
        const normalizedData = {};
        for (let key in data) {
          const normalizedKey = key.trim().toLowerCase();
          normalizedData[normalizedKey] = data[key] ? data[key].trim() : '';
        }
        
        // Skip empty rows
        if (normalizedData.firstname || normalizedData.phone) {
          results.push(normalizedData);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error('CSV parsing failed: ' + error.message));
      });
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Normalize headers and filter empty rows
    const normalizedData = data
      .map((row) => {
        const normalizedRow = {};
        for (let key in row) {
          const normalizedKey = key.trim().toLowerCase();
          normalizedRow[normalizedKey] = row[key] ? String(row[key]).trim() : '';
        }
        return normalizedRow;
      })
      .filter((row) => row.firstname || row.phone);

    return normalizedData;
  } catch (error) {
    throw new Error('Excel parsing failed: ' + error.message);
  }
};

// Distribute data among agents
const distributeData = (data, agents) => {
  const distributedRecords = [];
  const agentCount = agents.length;
  const recordsPerAgent = Math.floor(data.length / agentCount);
  const remainder = data.length % agentCount;

  let currentIndex = 0;

  // Distribute equal portions to all agents
  agents.forEach((agent, agentIndex) => {
    // Calculate how many records this agent should get
    // First 'remainder' agents get one extra record
    const recordsForThisAgent = recordsPerAgent + (agentIndex < remainder ? 1 : 0);

    for (let i = 0; i < recordsForThisAgent; i++) {
      if (currentIndex < data.length) {
        const record = data[currentIndex];
        distributedRecords.push({
          agentId: agent._id,
          agentName: agent.name,
          agentEmail: agent.email,
          firstName: record.firstname || '',
          phone: record.phone || '',
          notes: record.notes || '',
          uploadDate: new Date(),
        });
        currentIndex++;
      }
    }
  });

  return distributedRecords;
};

// @desc    Get distributed data
// @route   GET /api/upload/distributed
// @access  Private
export const getDistributedData = async (req, res) => {
  try {
    const distributedData = await DistributedData.find()
      .sort({ uploadDate: -1 })
      .lean();

    // Group by agent
    const groupedByAgent = {};
    distributedData.forEach((record) => {
      const agentId = record.agentId.toString();
      if (!groupedByAgent[agentId]) {
        groupedByAgent[agentId] = {
          agentId: record.agentId,
          agentName: record.agentName,
          agentEmail: record.agentEmail,
          records: [],
        };
      }
      groupedByAgent[agentId].records.push({
        _id: record._id,
        firstName: record.firstName,
        phone: record.phone,
        notes: record.notes,
        uploadDate: record.uploadDate,
      });
    });

    const result = Object.values(groupedByAgent);

    res.json({
      success: true,
      count: result.length,
      totalRecords: distributedData.length,
      data: result,
    });
  } catch (error) {
    console.error('Get distributed data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching distributed data',
    });
  }
};