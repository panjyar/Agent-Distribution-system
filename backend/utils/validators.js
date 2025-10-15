// Validate CSV headers
const validateCSVHeaders = (headers) => {
  const requiredHeaders = ['firstname', 'phone', 'notes'];
  
  // Normalize headers to lowercase
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Check if all required headers are present
  const missingHeaders = requiredHeaders.filter(
    header => !normalizedHeaders.includes(header)
  );
  
  if (missingHeaders.length > 0) {
    return {
      valid: false,
      message: `Missing required columns: ${missingHeaders.join(', ')}. Expected columns: FirstName, Phone, Notes`,
    };
  }
  
  return { valid: true };
};

// Validate email format
const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

// Validate mobile number with country code
const validateMobile = (mobile) => {
  const re = /^\+\d{1,4}\d{7,15}$/;
  return re.test(mobile);
};

// Validate password strength
const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  
  // Check for at least one special character
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character',
    };
  }
  
  return { valid: true };
};

export {
  validateCSVHeaders,
  validateEmail,
  validateMobile,
  validatePassword,
};