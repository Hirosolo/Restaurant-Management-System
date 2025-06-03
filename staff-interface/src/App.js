import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecipePage from './pages/RecipePage';
import StaffPage from './pages/StaffPage';
import InventoryPage from './pages/InventoryPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recipe" 
            element={
              <ProtectedRoute>
                <RecipePage />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/inventory" 
  element={
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  } 
/>
          <Route 
  path="/staff" 
  element={
    <ProtectedRoute>
      <StaffPage />
    </ProtectedRoute>
  } 
/>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;