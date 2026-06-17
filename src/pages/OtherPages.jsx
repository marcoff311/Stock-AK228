import { useApp } from "../context/AppContext";
import { CAT_ICONS, CAT_COLORS } from "../data/initialData";

export function CategoriesPage({ setCurrentPage }) {
  const { isDark, products } = useApp();
  const bg = isDark ? '#21262d' : '#fff';
  const border = isDark ? '#30363d' : '#e9ecef';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const text2 = isDark ? '#8b949e' : '#6c757d';
  const surfBg = isDark ? '#0d1117' : '#f8f9fa';

  const catStats = {};
  products.forEach(p => {
    if (!catStats[p.cat]) catStats[p.cat] = { count: 0, qty: 0, value: 0 };
    catStats[p.cat].count++;
    catStats[p.cat].qty += p.qty;
    catStats[p.cat].value += p.qty * p.price;
  });

  return (
    <div>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🗂️</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: text }}>Catégories de produits</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, padding: '1.2rem' }}>
          {Object.entries(catStats).map(([cat, stats]) => (
            <div key={cat}
              onClick={() => setCurrentPage('inventory')}
              style={{
                background: surfBg, border: `1.5px solid ${border}`,
                borderRadius: 13, padding: '1.4rem', cursor: 'pointer',
                transition: 'all .2s', textAlign: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = CAT_COLORS[cat] || '#4361ee';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${CAT_COLORS[cat]}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{CAT_ICONS[cat] || '📦'}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 8 }}>{cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 12, color: text2 }}>{stats.count} produit{stats.count > 1 ? 's' : ''}</div>
                <div style={{ fontSize: 12, color: text2 }}>{stats.qty} unités en stock</div>
                <div style={{
                  marginTop: 8, padding: '4px 10px', borderRadius: 8,
                  background: `${CAT_COLORS[cat]}18`, color: CAT_COLORS[cat],
                  fontSize: 12, fontWeight: 600
                }}>
                  {stats.value.toLocaleString()} FCFA
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const { isDark, products, getStatus, restockProduct } = useApp();
  const bg = isDark ? '#21262d' : '#fff';
  const border = isDark ? '#30363d' : '#e9ecef';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const text2 = isDark ? '#8b949e' : '#6c757d';

  const alertProds = products.filter(p => getStatus(p) !== 'En stock');

  const handleRestock = (p) => {
    const n = parseInt(prompt(`Réapprovisionner "${p.name}"\nQuantité à ajouter :`));
    if (!isNaN(n) && n > 0) restockProduct(p.id, n);
  };

  return (
    <div>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: text }}>
            <span>🔔</span> Centre des alertes
          </div>
          {alertProds.length > 0 && (
            <span style={{
              background: 'rgba(239,35,60,.12)', color: '#c81e3a',
              padding: '3px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600
            }}>
              {alertProds.length} alerte{alertProds.length > 1 ? 's' : ''} active{alertProds.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alertProds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: text2 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 6 }}>Aucune alerte active</div>
              <div style={{ fontSize: 13 }}>Tous vos produits sont en stock.</div>
            </div>
          ) : alertProds.map(p => {
            const isOut = p.qty === 0;
            return (
              <div key={p.id} style={{
                background: isOut ? 'rgba(239,35,60,.07)' : 'rgba(255,209,102,.08)',
                border: `1px solid ${isOut ? 'rgba(239,35,60,.2)' : 'rgba(255,209,102,.3)'}`,
                borderRadius: 14, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: 14
              }}>
                <span style={{ fontSize: 28 }}>{isOut ? '🚨' : '⚠️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: text }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: text2 }}>{p.ref}</span>
                  </div>
                  <div style={{ fontSize: 13, color: isOut ? '#ef233c' : '#f59f00', marginBottom: 3 }}>
                    {isOut ? '⛔ Rupture totale' : '⚠️ Stock faible'} — {p.qty} unité{p.qty !== 1 ? 's' : ''} (seuil minimum : {p.threshold})
                  </div>
                  <div style={{ fontSize: 12, color: text2 }}>Fournisseur : {p.supplier}</div>
                </div>
                <button onClick={() => handleRestock(p)} style={{
                  padding: '9px 18px', background: '#4361ee', color: '#fff',
                  border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}>
                  🚚 Commander
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
