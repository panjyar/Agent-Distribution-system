import { useState } from 'react';
import { toast } from 'react-toastify';
import { agentUploadFile } from '../services/api';

function AgentFileUpload({ onFileUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
      if (fileExtension !== 'csv') {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await agentUploadFile(formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file');
        if (fileInput) {
          fileInput.value = '';
        }
        onFileUploaded();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'File upload failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="file">Select CSV File</label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          required
        />
        <small className="form-text">
          Only CSV files are allowed. The file will be distributed among your sub-agents.
        </small>
      </div>

      {file && (
        <div className="file-info">
          <p>
            <strong>Selected file:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload and Distribute'}
      </button>
    </form>
  );
}

export default AgentFileUpload;