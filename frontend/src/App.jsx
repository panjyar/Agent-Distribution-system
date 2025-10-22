import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AgentLogin from './components/AgentLogin';
import AgentDashboard from './components/AgentDashboard';

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function ProtectedAgentRoute({ children }) {
  const token = localStorage.getItem('agentToken');
  return token ? children : <Navigate to="/agent-login" replace />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } 
          />
          
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route 
            path="/agent-dashboard" 
            element={
              <ProtectedAgentRoute>
                <AgentDashboard />
              </ProtectedAgentRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;