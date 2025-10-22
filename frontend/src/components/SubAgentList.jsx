import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSubAgents, deleteSubAgent } from '../services/api';

function SubAgentList({ onSubAgentDeleted }) {
  const [subAgents, setSubAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubAgents();
  }, []);

  const fetchSubAgents = async () => {
    try {
      const response = await getSubAgents();
      if (response.data.success) {
        setSubAgents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sub-agents:', error);
      toast.error('Failed to fetch sub-agents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sub-agent?')) {
      try {
        const response = await deleteSubAgent(id);
        if (response.data.success) {
          toast.success('Sub-agent deleted successfully');
          onSubAgentDeleted();
          fetchSubAgents();
        }
      } catch (error) {
        const message =
          error.response?.data?.message || 'Failed to delete sub-agent';
        toast.error(message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading sub-agents...</div>;
  }

  if (subAgents.length === 0) {
    return (
      <div className="empty-state">
        <p>No sub-agents created yet.</p>
        <p>Create your first sub-agent using the form above.</p>
      </div>
    );
  }

  return (
    <div className="agent-list">
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
          Total Sub-Agents: {subAgents.length}
        </span>
        <button 
          onClick={fetchSubAgents}
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
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subAgents.map((agent) => (
              <tr key={agent._id}>
                <td style={{ fontWeight: '500' }}>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.mobile}</td>
                <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(agent._id)}
                    className="btn btn-danger btn-sm"
                    style={{ 
                      padding: '4px 8px',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubAgentList;