import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadFile } from '../services/api';

function FileUpload({ onFileUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // State to track drag-over

  // Centralized function to validate the selected file
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedExtensions = ['csv', 'xls', 'xlsx'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Only CSV, XLS, and XLSX files are allowed');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  // Drag and Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0]; // Get the dropped file
    validateAndSetFile(droppedFile);
  };


  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadFile(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFile(null);
        // Reset file input if it exists
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        onFileUploaded();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'File upload failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`upload-section ${isDragging ? 'dragging-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default input
      />
      
      <label htmlFor="file-input" className="file-label">
        Choose File
      </label>

      <p style={{ margin: '15px 0', color: '#666' }}>
        or drag and drop it here
      </p>

      <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
        Required columns: <strong>FirstName</strong>, <strong>Phone</strong>, <strong>Notes</strong>
      </p>

      {file && (
        <div className="selected-file">
          Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
        </div>
      )}

      <button
        onClick={handleUpload}
        className="btn btn-primary" // Using your new btn-primary class
        disabled={loading || !file}
        style={{ marginTop: '20px' }}
      >
        {loading ? 'Uploading...' : 'Upload and Distribute'}
      </button>
    </div>
  );
}

export default FileUpload;