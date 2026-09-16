import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';
import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {

  
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {



  return (
    <Router>

      <AuthProvider>

          <AppRoutes />

      </AuthProvider>
    </Router>
  );
}