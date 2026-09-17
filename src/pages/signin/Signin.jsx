import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '../../utilities/axios';
import { useAuth } from '../../context/AuthContext';

// css

import './signin.css';

export default function Signin() {

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/signin', form);
      login(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fms-page">
      <div className="fms-doc d1" aria-hidden="true" />
      <div className="fms-doc d2" aria-hidden="true" />
      <div className="fms-doc d3" aria-hidden="true" />
      <div className="fms-doc d4" aria-hidden="true" />

      <div className="fms-card-wrap">
        <div className="fms-tab">FMS</div>
        <div className="fms-card">
          <h1 className="fms-heading">Welcome back</h1>
          <p className="fms-subheading">Sign in to get to your files.</p>

          {error && <div className="fms-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="fms-field">
              <label className="fms-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="fms-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="fms-field">
              <label className="fms-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="fms-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="fms-submit">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="fms-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
