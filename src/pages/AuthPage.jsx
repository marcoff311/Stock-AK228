import { useState } from "react";
import { useApp } from "../context/AppContext";

function makeInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AuthPage() {
  const { setCurrentUser, addToast, isDark } = useApp();
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('admin@Stock-AK228.com');
  const [loginPwd, setLoginPwd] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [regError, setRegError] = useState('');

  const doLogin = () => {
    if (!loginEmail) { setLoginError('Email requis pour se connecter.'); return; }
    setLoginError('');
    const name = loginEmail.split('@')[0];
    setCurrentUser({ name, email: loginEmail, initials: makeInitials(name) });
    addToast('success', `Bienvenue !`);
  };

  const doRegister = () => {
    if (!regName || !regEmail) { setRegError('Nom et email requis.'); return; }
    setRegError('');
    setTab('login');
    setLoginEmail(regEmail);
    addToast('success', 'Compte créé avec succès !');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)'
    }}>
      <div style={{
        background: isDark ? '#21262d' : '#fff',
        border: isDark ? '1px solid #30363d' : 'none',
        borderRadius: 20, padding: '2.5rem', width: 380,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 60, height: 60, background: 'linear-gradient(135deg,#4361ee,#7209b7)',
            borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '.75rem', fontSize: 28
          }}>📦</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: isDark ? '#e6edf3' : '#1a1a2e', margin: '0 0 4px' }}>Stock-AK228</h1>
          <p style={{ fontSize: 13, color: isDark ? '#8b949e' : '#6c757d', margin: 0 }}>Gestion de stock intelligente</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, background: isDark ? '#0d1117' : '#f8f9fa',
          borderRadius: 10, padding: 4, marginBottom: '1.5rem'
        }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, transition: 'all .2s',
              background: tab === t ? '#4361ee' : 'none',
              color: tab === t ? '#fff' : isDark ? '#8b949e' : '#6c757d'
            }}>
              {t === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <div>
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              placeholder="Email" type="email" style={inputStyle(isDark)} />
            <input value={loginPwd} onChange={e => setLoginPwd(e.target.value)}
              placeholder="Mot de passe" type="password" style={inputStyle(isDark)} />
            {loginError && <p style={{ color: '#ef233c', fontSize: 12, textAlign: 'center', margin: '0 0 10px' }}>{loginError}</p>}
            <button onClick={doLogin} style={btnStyle}>
              🔐 Se connecter
            </button>
            <p style={{ fontSize: 12, color: isDark ? '#8b949e' : '#6c757d', textAlign: 'center', marginTop: 12 }}>
              Démo : admin@Stock-AK228.com / n'importe quel mot de passe
            </p>
          </div>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <div>
            <input value={regName} onChange={e => setRegName(e.target.value)}
              placeholder="Nom complet" style={inputStyle(isDark)} />
            <input value={regEmail} onChange={e => setRegEmail(e.target.value)}
              placeholder="Email" type="email" style={inputStyle(isDark)} />
            <input value={regPwd} onChange={e => setRegPwd(e.target.value)}
              placeholder="Mot de passe" type="password" style={inputStyle(isDark)} />
            {regError && <p style={{ color: '#ef233c', fontSize: 12, textAlign: 'center', margin: '0 0 10px' }}>{regError}</p>}
            <button onClick={doRegister} style={btnStyle}>
              👤 Créer un compte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = (isDark) => ({
  width: '100%', padding: '12px 14px', border: `1.5px solid ${isDark ? '#30363d' : '#e9ecef'}`,
  borderRadius: 10, fontSize: 14, background: isDark ? '#0d1117' : '#fff',
  color: isDark ? '#e6edf3' : '#1a1a2e', marginBottom: 12, outline: 'none',
  boxSizing: 'border-box', display: 'block'
});

const btnStyle = {
  width: '100%', padding: 13, background: 'linear-gradient(135deg,#4361ee,#7209b7)',
  color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
  cursor: 'pointer'
};
