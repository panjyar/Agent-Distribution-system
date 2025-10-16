import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentForm from './AgentForm';
import AgentList from './AgentList';
import FileUpload from './FileUpload';
import DistributedLists from './DistributedLists';

function Dashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAgentAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleFileUploaded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Agent Management System</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Add New Agent</h2>
          <AgentForm onAgentAdded={handleAgentAdded} />
        </div>

        <div className="card">
          <h2>All Agents</h2>
          <AgentList key={`agents-${refreshKey}`} onAgentDeleted={handleAgentAdded} />
        </div>

        <div className="card">
          <h2>Upload Data File</h2>
          <FileUpload onFileUploaded={handleFileUploaded} />
        </div>

        <div className="card">
          <h2>Distributed Data</h2>
          <DistributedLists key={`distributed-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;