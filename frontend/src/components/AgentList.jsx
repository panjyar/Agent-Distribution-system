import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAgents, deleteAgent } from '../services/api';

function AgentList({ onAgentDeleted }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      if (response.data.success) {
        setAgents(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const response = await deleteAgent(id);
      if (response.data.success) {
        toast.success('Agent deleted successfully');
        setAgents(agents.filter((agent) => agent._id !== id));
        onAgentDeleted();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete agent';
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="loading">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return (
      <div className="empty-state">
        <p>No agents created yet</p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Create your first agent using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="agent-grid">
      {agents.map((agent) => (
        <div key={agent._id} className="agent-card">
          <h3>{agent.name}</h3>
          <p>
            <strong>Email:</strong> {agent.email}
          </p>
          <p>
            <strong>Mobile:</strong> {agent.mobile}
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Created: {new Date(agent.createdAt).toLocaleDateString()}
          </p>
          <button
            onClick={() => handleDelete(agent._id)}
            className="btn btn-danger"
          >
            Delete Agent
          </button>
        </div>
      ))}
    </div>
  );
}

export default AgentList;