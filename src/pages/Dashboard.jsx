import { useApp } from "../context/AppContext";

export default function Dashboard({ setCurrentPage }) {
  const { isDark, products, getStatus, activities, restockProduct } = useApp();

  const out = products.filter(p => p.qty === 0).length;
  const low = products.filter(p => p.qty > 0 && p.qty <= p.threshold).length;
  const ok = products.filter(p => p.qty > p.threshold).length;
  const pct = products.length ? ((ok / products.length) * 100).toFixed(1) : 0;

  const alertProds = products.filter(p => getStatus(p) !== 'En stock').slice(0, 5);

  const bg = isDark ? '#21262d' : '#fff';
  const border = isDark ? '#30363d' : '#e9ecef';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const text2 = isDark ? '#8b949e' : '#6c757d';
  const surfaceBg = isDark ? '#0d1117' : '#f8f9fa';

  const catData = {};
  products.forEach(p => { catData[p.cat] = (catData[p.cat] || 0) + p.qty; });
  const maxCatVal = Math.max(...Object.values(catData), 1);
  const catColors = ['#4361ee', '#7209b7', '#06d6a0', '#f59f00', '#ef233c'];

  const handleRestock = (p) => {
    const n = parseInt(prompt(`Réapprovisionner "${p.name}"\nQuantité à ajouter :`));
    if (!isNaN(n) && n > 0) restockProduct(p.id, n);
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: '1.5rem' }}>
        {[
          { icon: '📦', val: products.length, label: 'Produits total', trend: '+12 ce mois', trendColor: '#06d6a0', iconBg: 'rgba(67,97,238,.12)', iconColor: '#4361ee' },
          { icon: '✅', val: ok, label: 'En stock', trend: `${pct}% du total`, trendColor: '#06d6a0', iconBg: 'rgba(6,214,160,.12)', iconColor: '#06d6a0' },
          { icon: '⚠️', val: low, label: 'Stock faible', trend: 'Attention requise', trendColor: '#f59f00', iconBg: 'rgba(255,209,102,.15)', iconColor: '#f59f00' },
          { icon: '🚨', val: out, label: 'Rupture de stock', trend: 'Urgent', trendColor: '#ef233c', iconBg: 'rgba(239,35,60,.1)', iconColor: '#ef233c' },
        ].map((s, i) => (
          <div key={i} style={{
            background: bg, border: `1px solid ${border}`, borderRadius: 16,
            padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 13, background: s.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: text }}>{s.val}</div>
              <div style={{ fontSize: 12, color: text2, marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.trendColor, marginTop: 5 }}>{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Alerts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: '1.5rem' }}>
        {/* Bar chart */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: text }}>Stock par catégorie</span>
          </div>
          <div style={{ padding: '1.1rem' }}>
            {Object.entries(catData).map(([cat, val], i) => (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: text }}>{cat}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{val} unités</span>
                </div>
                <div style={{ height: 8, background: surfaceBg, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4, transition: 'width .6s ease',
                    width: `${(val / maxCatVal) * 100}%`,
                    background: catColors[i % catColors.length]
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut-style */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🥧</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: text }}>Répartition</span>
          </div>
          <div style={{ padding: '1.1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'En stock', val: ok, color: '#06d6a0' },
                { label: 'Stock faible', val: low, color: '#f59f00' },
                { label: 'Rupture', val: out, color: '#ef233c' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: row.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: text, flex: 1 }}>{row.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: text }}>{row.val}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: 12, background: surfaceBg, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: text2, marginBottom: 4 }}>Taux de disponibilité</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#06d6a0' }}>{pct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Alerts */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: text }}>
              <span>🚨</span> Alertes urgentes
            </div>
            <button onClick={() => setCurrentPage('alerts')} style={{
              padding: '5px 12px', border: 'none', background: 'rgba(255,255,255,.08)',
              color: isDark ? 'rgba(255,255,255,.7)' : '#6c757d', borderRadius: 8, cursor: 'pointer', fontSize: 11
            }}>Voir tout →</button>
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alertProds.length === 0 ? (
              <p style={{ textAlign: 'center', color: text2, padding: '1.5rem 0', fontSize: 13 }}>✅ Aucune alerte</p>
            ) : alertProds.map(p => {
              const isOut = p.qty === 0;
              return (
                <div key={p.id} style={{
                  background: isOut ? 'rgba(239,35,60,.07)' : 'rgba(255,209,102,.08)',
                  border: `1px solid ${isOut ? 'rgba(239,35,60,.2)' : 'rgba(255,209,102,.3)'}`,
                  borderRadius: 12, padding: '.85rem', display: 'flex', alignItems: 'center', gap: 10
                }}>
                  <span style={{ fontSize: 20 }}>{isOut ? '🚨' : '⚠️'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: text2, marginTop: 2 }}>
                      {isOut ? 'Rupture' : 'Stock faible'} — {p.qty} unité{p.qty !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button onClick={() => handleRestock(p)} style={{
                    padding: '5px 12px', background: '#4361ee', color: '#fff', border: 'none',
                    borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                  }}>Commander</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16 }}>
          <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: text }}>Activité récente</span>
          </div>
          <div>
            {activities.slice(0, 5).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '.7rem 1.1rem' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, fontSize: 13, color: text, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: text2, flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
