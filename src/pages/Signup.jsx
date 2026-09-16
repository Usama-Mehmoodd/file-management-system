import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utilities/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const res = await api.post('/signup', form);
      login(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fms-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .fms-page {
          --ink: #10182a;
          --ink-line: rgba(148, 168, 200, 0.09);
          --paper: #fbf7ef;
          --paper-ink: #1b2233;
          --paper-sub: #6b7280;
          --amber: #d98a3d;
          --amber-deep: #b06b26;
          --slate: #5b6b85;

          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          background: var(--ink);
          background-image:
            linear-gradient(var(--ink-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--ink-line) 1px, transparent 1px);
          background-size: 44px 44px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .fms-doc {
          position: absolute;
          width: 190px;
          height: 250px;
          background: var(--slate);
          opacity: 0.16;
          clip-path: polygon(0 0, 78% 0, 100% 22%, 100% 100%, 0 100%);
          border-radius: 2px;
        }
        .fms-doc.d1 { top: 8%; left: 10%; transform: rotate(-11deg); background: var(--paper); opacity: 0.05; }
        .fms-doc.d2 { bottom: 10%; left: 6%; transform: rotate(8deg); width: 150px; height: 195px; }
        .fms-doc.d3 { top: 12%; right: 8%; transform: rotate(14deg); width: 165px; height: 215px; background: var(--amber); opacity: 0.08; }
        .fms-doc.d4 { bottom: 6%; right: 12%; transform: rotate(-7deg); }

        @media (prefers-reduced-motion: no-preference) {
          .fms-doc { animation: fms-settle 900ms cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
          .fms-doc.d1 { animation-delay: 0ms; }
          .fms-doc.d2 { animation-delay: 60ms; }
          .fms-doc.d3 { animation-delay: 120ms; }
          .fms-doc.d4 { animation-delay: 180ms; }
          @keyframes fms-settle {
            from { opacity: 0; transform: translateY(16px) rotate(0deg) scale(0.96); }
          }
        }

        .fms-card-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 380px;
        }

        .fms-tab {
          position: relative;
          width: fit-content;
          margin-left: 1.75rem;
          padding: 0.4rem 1.1rem 0.6rem;
          background: var(--amber);
          color: #2a1a08;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0% 100%);
        }

        .fms-card {
          background: var(--paper);
          border: 1px solid rgba(16, 24, 42, 0.08);
          border-radius: 4px 10px 10px 10px;
          box-shadow: 0 24px 48px -12px rgba(6, 10, 20, 0.55);
          padding: 2.25rem 2rem 2rem;
        }

        .fms-heading {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-weight: 600;
          font-size: 1.65rem;
          color: var(--paper-ink);
          margin: 0 0 0.3rem;
        }

        .fms-subheading {
          color: var(--paper-sub);
          font-size: 0.87rem;
          margin: 0 0 1.5rem;
        }

        .fms-error {
          font-size: 0.85rem;
          color: #9a3b1f;
          background: #fbe9e2;
          border: 1px solid #f0c4b0;
          border-radius: 4px;
          padding: 0.55rem 0.75rem;
          margin-bottom: 1.1rem;
        }

        .fms-field { margin-bottom: 1.05rem; }

        .fms-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--paper-ink);
          margin-bottom: 0.35rem;
        }

        .fms-input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d8d2c4;
          background: #fffdf9;
          border-radius: 4px;
          padding: 0.55rem 0.7rem;
          font-size: 0.9rem;
          color: var(--paper-ink);
          font-family: 'Inter', sans-serif;
          transition: border-color 120ms ease;
        }
        .fms-input::placeholder { color: #a8a196; }
        .fms-input:focus {
          outline: none;
          border-color: var(--amber);
          box-shadow: 0 0 0 3px rgba(217, 138, 61, 0.18);
        }

        .fms-submit {
          width: 100%;
          margin-top: 0.4rem;
          background: var(--amber);
          color: #241505;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          border-radius: 4px;
          padding: 0.65rem;
          cursor: pointer;
          transition: background 120ms ease, transform 120ms ease;
        }
        .fms-submit:hover:not(:disabled) { background: var(--amber-deep); }
        .fms-submit:active:not(:disabled) { transform: translateY(1px); }
        .fms-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .fms-submit:focus-visible {
          outline: 2px solid var(--amber-deep);
          outline-offset: 2px;
        }

        .fms-footer {
          text-align: center;
          font-size: 0.85rem;
          color: var(--paper-sub);
          margin-top: 1.5rem;
        }
        .fms-footer a {
          color: var(--amber-deep);
          font-weight: 500;
          text-decoration: none;
        }
        .fms-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="fms-doc d1" aria-hidden="true" />
      <div className="fms-doc d2" aria-hidden="true" />
      <div className="fms-doc d3" aria-hidden="true" />
      <div className="fms-doc d4" aria-hidden="true" />

      <div className="fms-card-wrap">
        <div className="fms-tab">FMS</div>
        <div className="fms-card">
          <h1 className="fms-heading">Create an account</h1>
          <p className="fms-subheading">Start storing and organizing your files.</p>

          {error && <div className="fms-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="fms-field">
              <label className="fms-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="fms-input"
                placeholder="Jane Doe"
              />
            </div>

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
                minLength={6}
                className="fms-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="fms-submit">
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="fms-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
