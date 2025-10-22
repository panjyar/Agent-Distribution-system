import { useState } from 'react';
import { toast } from 'react-toastify';
import { createSubAgent } from '../services/api';

function SubAgentForm({ onSubAgentAdded }) {
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
      const response = await createSubAgent(formData);

      if (response.data.success) {
        toast.success('Sub-agent created successfully!');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: '',
        });
        onSubAgentAdded();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create sub-agent. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="agent-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter sub-agent name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter sub-agent email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="mobile">Mobile</label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter mobile number with country code (e.g., +911234567890)"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (min 6 characters)"
          required
          minLength={6}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Sub-Agent'}
      </button>
    </form>
  );
}

export default SubAgentForm;