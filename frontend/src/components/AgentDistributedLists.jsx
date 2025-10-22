import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAgentDistributedData } from '../services/api';

function AgentDistributedLists() {
  const [distributedData, setDistributedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistributedData();
  }, []);

  const fetchDistributedData = async () => {
    try {
      const response = await getAgentDistributedData();
      if (response.data.success) {
        setDistributedData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch distributed data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading distributed data...</div>;
  }

  if (distributedData.length === 0) {
    return (
      <div className="empty-state">
        <p>No data distributed yet</p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Upload a CSV/XLSX/XLS file to distribute data among your sub-agents
        </p>
      </div>
    );
  }

  return (
    <div className="distribution-grid">
      {distributedData.map((agentData) => (
        <div key={agentData.agentId} className="agent-distribution">
          <h3>{agentData.agentName}</h3>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            {agentData.agentEmail}
          </p>
          <p style={{ fontWeight: 'bold', color: '#667eea' }}>
            Total Records: {agentData.records.length}
          </p>

          {agentData.records.length > 0 && (
            <table className="records-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {agentData.records.map((record) => (
                  <tr key={record._id}>
                    <td>{record.firstName}</td>
                    <td>{record.phone}</td>
                    <td>{record.notes || '-'}</td>
                    <td>{new Date(record.uploadDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

export default AgentDistributedLists;