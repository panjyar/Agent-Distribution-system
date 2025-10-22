import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentForm from './AgentForm';
import AgentList from './AgentList';
import FileUpload from './FileUpload';
import DistributedLists from './DistributedLists';

function Dashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Get admin email if stored
      const email = localStorage.getItem('adminEmail');
      if (email) {
        setAdminEmail(email);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
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
        <div>
          <h1>Admin Dashboard</h1>
          {adminEmail && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
              Logged in as: {adminEmail}
            </p>
          )}
        </div>
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
          <h2>My Agents</h2>
          <AgentList 
            key={`agents-${refreshKey}`} 
            onAgentDeleted={handleAgentAdded} 
          />
        </div>

        <div className="card">
          <h2>Upload Data File</h2>
          <FileUpload onFileUploaded={handleFileUploaded} />
        </div>

        <div className="card">
          <h2>Distributed Data to Agents</h2>
          <DistributedLists key={`distributed-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;