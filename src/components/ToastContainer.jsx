import { useApp } from "../context/AppContext";

const typeConfig = {
  danger: { icon: '🚨', color: '#ef233c' },
  warning: { icon: '⚠️', color: '#f59f00' },
  success: { icon: '✅', color: '#06d6a0' },
};

export default function ToastContainer() {
  const { toasts, dismissToast, isDark } = useApp();

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      zIndex: 300, display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none'
    }}>
      {toasts.map(t => {
        const cfg = typeConfig[t.type] || typeConfig.success;
        return (
          <div key={t.id} style={{
            background: isDark ? '#21262d' : '#fff',
            border: `1px solid ${isDark ? '#30363d' : '#e9ecef'}`,
            borderLeft: `4px solid ${cfg.color}`,
            borderRadius: 13, padding: '.9rem 1.1rem',
            display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 280, maxWidth: 380,
            boxShadow: '0 8px 32px rgba(0,0,0,.15)',
            animation: 'slideIn .3s ease',
            pointerEvents: 'all'
          }}>
            <span style={{ fontSize: 20 }}>{cfg.icon}</span>
            <div style={{ flex: 1, fontSize: 13, color: isDark ? '#e6edf3' : '#1a1a2e', lineHeight: 1.4 }}>
              {t.message}
            </div>
            <button onClick={() => dismissToast(t.id)} style={{
              background: 'none', border: 'none', color: isDark ? '#8b949e' : '#6c757d',
              cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1
            }}>✕</button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}
