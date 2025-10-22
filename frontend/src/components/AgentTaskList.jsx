import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAgentTasks } from '../services/api';

function AgentTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a method to refresh tasks that can be called from parent
  const refreshTasks = () => {
    fetchTasks();
  };

  // Expose refresh method to parent component
  useEffect(() => {
    if (window.refreshAgentTasks) {
      window.refreshAgentTasks = refreshTasks;
    } else {
      window.refreshAgentTasks = refreshTasks;
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getAgentTasks();
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading assigned tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks assigned yet.</p>
        <p>Your admin will assign tasks to you here.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
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
          Total Assigned Tasks: {tasks.length}
        </span>
        <button 
          onClick={refreshTasks}
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
              <th>Phone</th>
              <th>Notes</th>
              <th>Assigned Date</th>
              <th>Distributed By</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
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
                <td style={{ 
                  color: '#0c5727',
                  fontWeight: '500'
                }}>
                  {task.distributedByEmail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentTaskList;