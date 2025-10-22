import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SubAgentForm from './SubAgentForm';
import SubAgentList from './SubAgentList';
import AgentFileUpload from './AgentFileUpload';
import AgentTaskList from './AgentTaskList';
import AgentDistributedList from './AgentDistributedList';

function AgentDashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('agentToken');
    if (!token) {
      navigate('/agent-login');
    } else {
      // Get agent info if stored
      const name = localStorage.getItem('agentName');
      const email = localStorage.getItem('agentEmail');
      if (name) {
        setAgentName(name);
      }
      if (email) {
        setAgentEmail(email);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentName');
    localStorage.removeItem('agentEmail');
    navigate('/agent-login');
  };

  const handleSubAgentAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleFileUploaded = () => {
    setRefreshKey((prev) => prev + 1);
    // Also refresh the tasks list
    if (window.refreshAgentTasks) {
      window.refreshAgentTasks();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Agent Dashboard</h1>
          {agentName && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
              Logged in as: {agentName} ({agentEmail})
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>My Assigned Tasks</h2>
          <AgentTaskList key={`tasks-${refreshKey}`} />
        </div>

        <div className="card">
          <h2>Add New Sub-Agent</h2>
          <SubAgentForm onSubAgentAdded={handleSubAgentAdded} />
        </div>

        <div className="card">
          <h2>My Sub-Agents</h2>
          <SubAgentList 
            key={`sub-agents-${refreshKey}`} 
            onSubAgentDeleted={handleSubAgentAdded} 
          />
        </div>

        <div className="card">
          <h2>Upload Data File</h2>
          <AgentFileUpload onFileUploaded={handleFileUploaded} />
        </div>

        <div className="card">
          <h2>Tasks Distributed to Sub-Agents</h2>
          <AgentDistributedList key={`distributed-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;