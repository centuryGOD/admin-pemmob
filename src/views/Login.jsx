import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simulasi autentikasi admin kelurahan
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess();
    } else {
      setError('Username atau password salah! (Gunakan: admin / admin123)');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--accent)', color: '#fff', marginBottom: '16px' }}>
            <Shield size={32} />
          </div>
          <h2>Admin Kelurahan</h2>
          <p>Sistem Pelaporan Kerusakan Infrastruktur Berbasis Geotagging</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Masukkan username admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--status-pending)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', backgroundColor: 'var(--status-pending-bg)', padding: '10px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn">
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
