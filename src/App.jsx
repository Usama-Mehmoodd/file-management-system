import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';
import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// sequence bootstrap first, then the design system, then your own CSS.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './App.css';

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
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
