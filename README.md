# Agent Management System - MERN Stack

A comprehensive full-stack application for managing agents and distributing data records among them. Built with MongoDB, Express.js, React (Vite), and Node.js.

## 🌟 Features

- ✅ **Admin Authentication**: Secure registration and login with JWT
- ✅ **Agent Management**: Create, view, and delete agents
- ✅ **File Upload**: Support for CSV, XLSX, and XLS files
- ✅ **Dynamic Distribution**: Automatically distributes data among any number of agents
- ✅ **Real-time Dashboard**: View agents and distributed data in real-time
- ✅ **Comprehensive Validation**: Both frontend and backend validation
- ✅ **Error Handling**: All edge cases covered with user-friendly messages
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
# If you have the project as a zip file, extract it
# Navigate to the project directory
cd agent-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the following content into backend/.env
```

**backend/.env**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agent-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345!@#$%
NODE_ENV=development
```

**Important Notes for .env:**
- If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string
- Change `JWT_SECRET` to a random, secure string in production
- Make sure MongoDB is running on your system

**Start MongoDB (if using local installation):**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Start the Backend Server:**
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### 3. Frontend Setup

Open a **new terminal window** and:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
# Copy the following content into frontend/.env
```

**frontend/.env**:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the Frontend:**
```bash
npm run dev
```

You should see:
```
  VITE v4.3.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Usage Guide

### Step 1: Register an Admin Account

1. Click on "Register here" link on the login page
2. Enter your email and password (min 6 characters with special character)
3. Confirm your password
4. Click "Register"

### Step 2: Create Agents

1. After logging in, you'll see the dashboard
2. Use the "Add New Agent" form to create agents
3. Required fields:
   - Name
   - Email
   - Mobile (with country code, e.g., +911234567890)
   - Password (min 6 characters with special character)

### Step 3: Upload Data File

1. Prepare a CSV/XLSX/XLS file with these columns:
   - **FirstName** (text)
   - **Phone** (number)
   - **Notes** (text)

**Example CSV:**
```csv
FirstName,Phone,Notes
John,9876543210,Important client
Jane,9876543211,Follow up needed
Mike,9876543212,New lead
Sarah,9876543213,Interested in premium
Tom,9876543214,Schedule callback
```

2. Click "Choose File" in the "Upload Data File" section
3. Select your file (must be CSV, XLS, or XLSX, max 5MB)
4. Click "Upload and Distribute"

### Step 4: View Distributed Data

Scroll down to see how the records have been distributed among your agents. Each agent will receive an equal number of records, with remainder records distributed to the first few agents.

## 📊 Distribution Logic

The system uses intelligent distribution:
- **25 records + 5 agents** = 5 records each
- **23 records + 5 agents** = 5, 5, 5, 4, 4 (first 3 get extra)
- **10 records + 3 agents** = 4, 3, 3

The distribution automatically adapts to any number of agents!

## 🗂️ Project Structure

```
agent-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin auth logic
│   │   ├── agentController.js    # Agent CRUD operations
│   │   └── uploadController.js   # File upload & distribution
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── Admin.js              # Admin schema
│   │   ├── Agent.js              # Agent schema
│   │   └── DistributedData.js    # Distributed records schema
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin routes
│   │   ├── agentRoutes.js        # Agent routes
│   │   └── uploadRoutes.js       # Upload routes
│   ├── uploads/                  # Uploaded files (temporary)
│   ├── utils/
│   │   └── validators.js         # Validation functions
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── AgentForm.jsx     # Agent creation form
│   │   │   ├── AgentList.jsx     # Display all agents
│   │   │   ├── FileUpload.jsx    # File upload component
│   │   │   └── DistributedLists.jsx  # Show distributed data
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── main.jsx              # Entry point
│   ├── .env                      # Environment variables
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Admin Routes
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login

### Agent Routes (Protected)
- `POST /api/agents` - Create new agent
- `GET /api/agents` - Get all agents
- `DELETE /api/agents/:id` - Delete agent

### Upload Routes (Protected)
- `POST /api/upload` - Upload and distribute file
- `GET /api/upload/distributed` - Get distributed data

## 🛡️ Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication (30-day expiry)
- Protected API routes
- Input validation on both frontend and backend
- File type and size validation
- SQL injection prevention (using Mongoose)
- XSS protection

## ⚠️ Edge Cases Handled

1. **Duplicate Prevention**: Email and mobile uniqueness checks
2. **Empty Files**: Validation before processing
3. **Invalid Headers**: CSV column validation
4. **No Agents**: Cannot upload without creating agents first
5. **Network Errors**: User-friendly error messages
6. **Token Expiration**: Automatic redirect to login
7. **File Size Limits**: Max 5MB per file
8. **Invalid File Types**: Only CSV, XLS, XLSX allowed
9. **Password Strength**: Minimum requirements enforced
10. **Concurrent Operations**: Proper error handling

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "MongoDB connection failed"**
- Ensure MongoDB is running
- Check MONGO_URI in .env
- For local MongoDB: `mongodb://localhost:27017/agent-management`
- For Atlas: Use your connection string

### Frontend won't start

**Error: "Port 5173 already in use"**
```bash
# Kill the process or change port in vite.config.js
```

**Error: API calls failing**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Open browser console for detailed errors

### File Upload Issues

**"Invalid file type"**
- Ensure file is CSV, XLS, or XLSX
- Check file extension is correct

**"File parsing failed"**
- Verify CSV has correct columns: FirstName, Phone, Notes
- Check for special characters or encoding issues
- Try saving file with UTF-8 encoding

## 🧪 Testing the Application

### Test Data for Agents

Create at least 3-5 agents with these details:

1. Agent 1: John Doe, john@example.com, +911234567890
2. Agent 2: Jane Smith, jane@example.com, +919876543210
3. Agent 3: Mike Johnson, mike@example.com, +918765432109

### Sample CSV Data

Save this as `test_data.csv`:
```csv
FirstName,Phone,Notes
Alice,9876543210,High priority client
Bob,9876543211,Follow up next week
Charlie,9876543212,Interested in product A
David,9876543213,Schedule demo call
Eve,9876543214,Sent proposal
Frank,9876543215,Awaiting response
Grace,9876543216,Hot lead
Henry,9876543217,Budget approved
Ivy,9876543218,Decision maker
Jack,9876543219,Referral from Alice
```

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- multer: File upload handling
- csv-parser: CSV file parsing
- xlsx: Excel file parsing
- cors: CORS middleware
- dotenv: Environment variables

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- react-toastify: Toast notifications
- vite: Build tool

## 🚢 Production Deployment

### Backend
1. Set NODE_ENV=production in .env
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas for database
4. Deploy to Heroku, Railway, or similar

### Frontend
1. Update VITE_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy dist folder to Netlify, Vercel, or similar
