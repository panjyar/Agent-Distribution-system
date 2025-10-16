import { useState } from 'react';
import { toast } from 'react-toastify';
import { createAgent } from '../services/api';

function AgentForm({ onAgentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createAgent(formData);

      if (response.data.success) {
        toast.success('Agent created successfully!');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: '',
        });
        onAgentAdded();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create agent. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter agent name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="mobile">Mobile with Country Code *</label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="+911234567890"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 6 chars with special character"
          required
        />
      </div>

      <button type="submit" className="btn btn-secondary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Agent'}
      </button>
    </form>
  );
}

export default AgentForm;