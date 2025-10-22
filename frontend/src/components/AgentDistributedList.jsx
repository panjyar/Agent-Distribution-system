import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAgentDistributedData } from '../services/api';

function AgentDistributedList() {
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
      console.error('Error fetching distributed data:', error);
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
        <p>No tasks distributed yet.</p>
        <p>Upload a file to distribute tasks to your sub-agents.</p>
      </div>
    );
  }

  return (
    <div className="distributed-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px 16px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <span style={{ 
          fontWeight: '600', 
          color: '#2c3e2f',
          fontSize: '16px'
        }}>
          Total Distributed Tasks: {distributedData.length}
        </span>
        <button 
          onClick={fetchDistributedData}
          className="btn btn-secondary btn-sm"
          style={{ 
            padding: '6px 12px',
            fontSize: '12px'
          }}
        >
          Refresh
        </button>
      </div>
      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Sub-Agent Name</th>
              <th>Sub-Agent Email</th>
              <th>Task Name</th>
              <th>Phone</th>
              <th>Notes</th>
              <th>Distributed Date</th>
            </tr>
          </thead>
          <tbody>
            {distributedData.map((task) => (
              <tr key={task._id}>
                <td style={{ fontWeight: '500' }}>{task.agentName}</td>
                <td>{task.agentEmail}</td>
                <td style={{ fontWeight: '500' }}>{task.firstName}</td>
                <td>{task.phone}</td>
                <td style={{ 
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {task.notes || 'No notes'}
                </td>
                <td>{new Date(task.uploadDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentDistributedList;
