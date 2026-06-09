import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://banking-finance-api-production.up.railway.app/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://banking-finance-api-production.up.railway.app/auth/register', { username, password });
      setIsLogin(true);
      setError('');
      alert('Registered! Please login.');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.brand}>
        <div style={s.brandIcon}>🏦</div>
        <div>
          <div style={s.brandName}>RexBank</div>
          <div style={s.brandSub}>SECURE BANKING</div>
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>{isLogin ? 'Welcome back' : 'Create account'}</div>
        <div style={s.cardSub}>{isLogin ? 'Sign in to your account' : 'Register a new account'}</div>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.fieldLabel}>USERNAME</div>
        <input style={s.input} placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        <div style={s.fieldLabel}>PASSWORD</div>
        <input style={s.input} placeholder="Enter password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={s.btn} onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? '🔓 Sign In' : '✅ Register'}
        </button>
        <div style={s.divider}><div style={s.line}/><span style={s.orText}>or</span><div style={s.line}/></div>
        <div style={s.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.switchLink} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0f1923', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' },
  brandIcon: { fontSize: '28px' },
  brandName: { fontSize: '20px', fontWeight: 'bold', color: 'white' },
  brandSub: { fontSize: '10px', color: '#6b7f93', letterSpacing: '1.5px' },
  card: { background: '#17212e', border: '1px solid #1e2d3d', borderRadius: '12px', padding: '24px', width: '320px' },
  cardTitle: { fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px' },
  cardSub: { fontSize: '13px', color: '#6b7f93', marginBottom: '20px' },
  fieldLabel: { fontSize: '10px', color: '#6b7f93', letterSpacing: '0.5px', marginBottom: '4px' },
  input: { width: '100%', background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: '6px', padding: '10px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#1a73e8', border: 'none', borderRadius: '6px', padding: '11px', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' },
  error: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '6px', padding: '8px', fontSize: '13px', marginBottom: '12px' },
  divider: { display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0' },
  line: { flex: 1, height: '1px', background: '#1e2d3d' },
  orText: { fontSize: '12px', color: '#6b7f93' },
  switchText: { textAlign: 'center', fontSize: '13px', color: '#6b7f93' },
  switchLink: { color: '#1a73e8', cursor: 'pointer' }
};

export default Login;