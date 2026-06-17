import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Header({ currentPage, setCurrentPage }) {
  const { isDark, toggleTheme, currentUser, setCurrentUser, notifications, clearNotifications } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'inventory', label: 'Inventaire', icon: '📦' },
    { id: 'categories', label: 'Catégories', icon: '🗂️' },
    { id: 'alerts', label: 'Alertes', icon: '🔔' },
  ];

  const typeColors = { danger: '#ef233c', warning: '#f59f00', success: '#06d6a0' };

  return (
    <>
      <header style={{
        background: isDark ? '#010409' : '#1a1a2e',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center',
        gap: '1rem', height: 60, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontWeight: 700, fontSize: 17, flex: 1 }}>
          <div style={{
            width: 34, height: 34, background: 'linear-gradient(135deg,#4361ee,#7209b7)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>📦</div>
          Stock-AK228
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{
              padding: '7px 14px', border: 'none',
              background: currentPage === item.id ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.08)',
              color: currentPage === item.id ? '#fff' : 'rgba(255,255,255,.7)',
              borderRadius: 9, cursor: 'pointer', fontSize: 13, display: 'flex',
              alignItems: 'center', gap: 6, transition: 'all .2s'
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notif button */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setNotifOpen(o => !o)} style={{
              position: 'relative', background: 'rgba(255,255,255,.1)', border: 'none',
              color: '#fff', width: 38, height: 38, borderRadius: 9, cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              🔔
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, background: '#ef233c',
                  minWidth: 18, height: 18, borderRadius: 9, fontSize: 10, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, padding: '0 4px', border: '2px solid #010409'
                }}>{notifications.length}</span>
              )}
            </button>

            {/* Notif Panel */}
            {notifOpen && (
              <div style={{
                position: 'absolute', top: 46, right: 0, width: 340,
                background: isDark ? '#21262d' : '#fff',
                border: `1px solid ${isDark ? '#30363d' : '#e9ecef'}`,
                borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,.2)', zIndex: 200
              }}>
                <div style={{
                  padding: '.9rem 1.1rem', borderBottom: `1px solid ${isDark ? '#30363d' : '#e9ecef'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#e6edf3' : '#1a1a2e' }}>
                    🔔 Notifications
                  </span>
                  <button onClick={clearNotifications} style={{
                    background: 'none', border: 'none', color: '#4361ee', fontSize: 12, cursor: 'pointer'
                  }}>Tout effacer</button>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: 13, color: isDark ? '#8b949e' : '#6c757d' }}>
                      ✅ Aucune notification
                    </div>
                  ) : notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '.8rem 1.1rem',
                      borderBottom: `1px solid ${isDark ? '#30363d' : '#e9ecef'}`,
                      display: 'flex', gap: 10
                    }}>
                      <div style={{
                        width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                        background: typeColors[n.type] || '#4361ee'
                      }} />
                      <div>
                        <div style={{ fontSize: 13, color: isDark ? '#e6edf3' : '#1a1a2e', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: isDark ? '#8b949e' : '#6c757d', marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme} title="Changer le thème" style={{
            background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff',
            width: 38, height: 38, borderRadius: 9, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: 'linear-gradient(135deg,#4361ee,#7209b7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
          }}>
            {currentUser?.initials || 'AD'}
          </div>

          {/* Logout */}
          <button onClick={() => setCurrentUser(null)} style={{
            background: 'rgba(239,35,60,.15)', border: '1px solid rgba(239,35,60,.3)',
            color: '#f85149', padding: '7px 14px', borderRadius: 9, cursor: 'pointer',
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 5
          }}>
            🚪 Déconnexion
          </button>
        </div>
      </header>

      {/* Overlay to close notif panel */}
      {notifOpen && (
        <div onClick={() => setNotifOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
      )}
    </>
  );
}
