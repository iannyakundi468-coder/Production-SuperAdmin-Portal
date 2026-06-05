import { useState } from 'react';
import { api } from '../lib/api';
import SomoBloomLogo from '../components/layout/SomoBloomLogo';
import AnimatedIntro from '../components/AnimatedIntro';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (response.user && response.user.role !== 'admin') {
        throw new Error('Access denied: Admin accounts only.');
      }

      localStorage.setItem('somobloom_token', response.token);
      localStorage.setItem('somobloom_user', JSON.stringify(response.user));
      onLogin();
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={() => setShowIntro(false)} />}
      <div className="login-page" style={{ opacity: showIntro ? 0 : 1, transition: 'opacity 1s ease-in' }}>
      <div className="login-card">

        {/* Brand Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, gap: 12 }}>
          <SomoBloomLogo size={60} showText={false} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Somo<span style={{ color: '#4f46e5' }}>Bloom</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
              School Management System
            </div>
          </div>
        </div>

        <h1 className="login-title">Administrator Sign In</h1>
        <p className="login-subtitle">Access the SomoBloom control panel to manage your school.</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Email or Phone Number</label>
            <input
              id="admin-email"
              className="input"
              type="text"
              placeholder="admin@somobloom.ac.ke or Phone Number"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign In to SomoBloom'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
          Admin access only · SomoBloom Africa © {new Date().getFullYear()}
        </p>
      </div>
    </div>
    </>
  );
}
