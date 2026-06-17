import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";

const emptyForm = { name: '', ref: '', cat: 'Électronique', qty: '', threshold: '', price: '', supplier: '' };

export default function ProductModal({ product, onClose }) {
  const { isDark, addProduct, updateProduct } = useApp();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (product) {
      setForm({ ...product, qty: String(product.qty), threshold: String(product.threshold), price: String(product.price) });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = {
      name: form.name.trim(),
      ref: form.ref || 'REF-' + Date.now(),
      cat: form.cat,
      qty: parseInt(form.qty) || 0,
      threshold: parseInt(form.threshold) || 10,
      price: parseInt(form.price) || 0,
      supplier: form.supplier || '—',
    };
    if (product) updateProduct(product.id, data);
    else addProduct(data);
    onClose();
  };

  const bg = isDark ? '#21262d' : '#fff';
  const border = isDark ? '#30363d' : '#e9ecef';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const inputBg = isDark ? '#0d1117' : '#f8f9fa';

  const inp = (extra = {}) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${border}`, borderRadius: 10,
    fontSize: 14, background: inputBg, color: text,
    outline: 'none', boxSizing: 'border-box',
    ...extra
  });

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: bg, borderRadius: 20, padding: '2.2rem',
        width: 460, maxWidth: '95vw', maxHeight: '92vh', overflowY: 'auto',
        border: `1px solid ${border}`
      }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: text, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          📦 {product ? 'Modifier le produit' : 'Nouveau produit'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <Label isDark={isDark}>Nom du produit</Label>
            <input style={inp()} value={form.name} onChange={e => set('name', e.target.value)} placeholder="ex: MacBook Pro" />
          </div>
          <div>
            <Label isDark={isDark}>Référence</Label>
            <input style={inp()} value={form.ref} onChange={e => set('ref', e.target.value)} placeholder="ex: MBP-001" />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label isDark={isDark}>Catégorie</Label>
          <select style={inp()} value={form.cat} onChange={e => set('cat', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <Label isDark={isDark}>Quantité en stock</Label>
            <input style={inp()} type="number" min="0" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label isDark={isDark}>Seuil d'alerte</Label>
            <input style={inp()} type="number" min="1" value={form.threshold} onChange={e => set('threshold', e.target.value)} placeholder="10" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <Label isDark={isDark}>Prix unitaire (FCFA)</Label>
            <input style={inp()} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label isDark={isDark}>Fournisseur</Label>
            <input style={inp()} value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="Nom du fournisseur" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{
            padding: '10px 22px', border: `1.5px solid ${border}`,
            background: 'none', borderRadius: 10, cursor: 'pointer', color: text, fontSize: 14
          }}>Annuler</button>
          <button onClick={handleSave} style={{
            padding: '10px 26px', background: 'linear-gradient(135deg,#4361ee,#7209b7)',
            color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600,
            cursor: 'pointer', fontSize: 14
          }}>💾 Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function Label({ children, isDark }) {
  return (
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 600,
      color: isDark ? '#8b949e' : '#6c757d', marginBottom: 6,
      textTransform: 'uppercase', letterSpacing: '.05em'
    }}>{children}</label>
  );
}
