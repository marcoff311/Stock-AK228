import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductModal from "../components/ProductModal";
import { CATEGORIES } from "../data/initialData";

function StockBar({ p }) {
  const max = Math.max(p.threshold * 3, p.qty, 1);
  const pct = Math.min((p.qty / max) * 100, 100);
  const color = p.qty === 0 ? '#ef233c' : p.qty <= p.threshold ? '#ffd166' : '#06d6a0';
  return (
    <div style={{ width: 110 }}>
      <div style={{ height: 7, background: 'rgba(128,128,128,.15)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`, background: color, transition: 'width .4s' }} />
      </div>
      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 3 }}>{p.qty} / {max}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    'Rupture': { bg: 'rgba(239,35,60,.12)', color: '#c81e3a', icon: '❌' },
    'Stock faible': { bg: 'rgba(255,209,102,.2)', color: '#b37400', icon: '⚠️' },
    'En stock': { bg: 'rgba(6,214,160,.12)', color: '#06a881', icon: '✅' },
  }[status] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: cfg.bg, color: cfg.color
    }}>
      {cfg.icon} {status}
    </span>
  );
}

export default function InventoryPage() {
  const { isDark, products, getStatus, deleteProduct, adjustStock, restockProduct } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed, null = new, obj = edit

  const bg = isDark ? '#21262d' : '#fff';
  const border = isDark ? '#30363d' : '#e9ecef';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const text2 = isDark ? '#8b949e' : '#6c757d';
  const surfBg = isDark ? '#0d1117' : '#f8f9fa';

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const mQ = !q || p.name.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q);
    const mC = !catFilter || p.cat === catFilter;
    const mS = !statusFilter || getStatus(p) === statusFilter;
    return mQ && mC && mS;
  });

  const handleAdjust = (p) => {
    const n = parseInt(prompt(`Ajuster le stock de "${p.name}"\n(ex: +20 pour ajouter, -5 pour retirer)`));
    if (!isNaN(n)) adjustStock(p.id, n);
  };

  const handleRestock = (p) => {
    const n = parseInt(prompt(`Réapprovisionner "${p.name}"\nQuantité à ajouter :`));
    if (!isNaN(n) && n > 0) restockProduct(p.id, n);
  };

  const thStyle = {
    textAlign: 'left', padding: '.7rem 1rem', fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '.05em', color: text2,
    background: surfBg, borderBottom: `1px solid ${border}`
  };
  const tdStyle = { padding: '.8rem 1rem', borderBottom: `1px solid ${border}`, color: text };

  const inputStyle = {
    padding: '9px 12px', border: `1.5px solid ${border}`, borderRadius: 10,
    fontSize: 13, background: surfBg, color: text, outline: 'none'
  };

  return (
    <div>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '.95rem 1.2rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: text }}>
            <span>📦</span> Inventaire des produits
            <span style={{ fontSize: 12, color: text2, fontWeight: 400 }}>({filtered.length} produits)</span>
          </div>
          <button onClick={() => setModalProduct(null)} style={{
            padding: '9px 18px', background: '#4361ee', color: '#fff', border: 'none',
            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            ＋ Ajouter un produit
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          padding: '.85rem 1.1rem', borderBottom: `1px solid ${border}`, flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher nom, référence, fournisseur..."
              style={{ ...inputStyle, paddingLeft: 36, width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={inputStyle}>
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
            <option value="">Tous les statuts</option>
            <option>En stock</option>
            <option>Stock faible</option>
            <option>Rupture</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={thStyle}>Produit</th>
                <th style={thStyle}>Catégorie</th>
                <th style={thStyle}>Quantité</th>
                <th style={thStyle}>Niveau</th>
                <th style={thStyle}>Prix</th>
                <th style={thStyle}>Fournisseur</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: text2 }}>
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(67,97,238,.06)' : 'rgba(67,97,238,.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: text2 }}>{p.ref}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      background: 'rgba(67,97,238,.1)', color: '#4361ee',
                      padding: '3px 9px', borderRadius: 7, fontSize: 12
                    }}>{p.cat}</span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, fontSize: 18 }}>{p.qty}</td>
                  <td style={tdStyle}><StockBar p={p} /></td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{p.price.toLocaleString()} FCFA</td>
                  <td style={{ ...tdStyle, color: text2, fontSize: 12 }}>{p.supplier}</td>
                  <td style={tdStyle}><StatusBadge status={getStatus(p)} /></td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { icon: '✏️', title: 'Modifier', onClick: () => setModalProduct(p) },
                        { icon: '➕', title: 'Ajuster le stock', onClick: () => handleAdjust(p) },
                        { icon: '🚚', title: 'Réapprovisionner', onClick: () => handleRestock(p) },
                        { icon: '🗑️', title: 'Supprimer', onClick: () => { if (confirm(`Supprimer "${p.name}" ?`)) deleteProduct(p.id); } },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.onClick} title={btn.title} style={{
                          width: 32, height: 32, border: `1px solid ${border}`,
                          background: bg, borderRadius: 8, cursor: 'pointer',
                          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all .2s'
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4361ee'; e.currentTarget.style.background = 'rgba(67,97,238,.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = bg; }}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalProduct !== undefined && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(undefined)} />
      )}
    </div>
  );
}
