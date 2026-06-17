import { createContext, useContext, useState, useCallback } from "react";
import { initialProducts, initialActivities, initialNotifications } from "../data/initialData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);

  const toggleTheme = () => setIsDark(d => !d);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const addNotification = useCallback((type, text) => {
    const id = Date.now();
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setNotifications(n => [{ id, type, text, time }, ...n]);
    addToast(type, text);
  }, [addToast]);

  const clearNotifications = () => setNotifications([]);

  const addActivity = useCallback((color, text) => {
    const id = Date.now();
    setActivities(a => [{ id, color, text, time: "À l'instant" }, ...a.slice(0, 9)]);
  }, []);

  const getStatus = (p) => {
    if (p.qty === 0) return 'Rupture';
    if (p.qty <= p.threshold) return 'Stock faible';
    return 'En stock';
  };

  const addProduct = useCallback((data) => {
    const id = Date.now();
    const p = { ...data, id };
    setProducts(prev => [p, ...prev]);
    addActivity('#7209b7', `Nouveau produit ajouté — ${p.name}`);
    if (p.qty === 0) addNotification('danger', `Rupture de stock : ${p.name} (0 unité)`);
    else if (p.qty <= p.threshold) addNotification('warning', `Stock faible : ${p.name} (${p.qty} unités)`);
    else addToast('success', `Produit ajouté : ${p.name}`);
  }, [addActivity, addNotification, addToast]);

  const updateProduct = useCallback((id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    addToast('success', `Produit mis à jour : ${data.name}`);
  }, [addToast]);

  const deleteProduct = useCallback((id) => {
    const p = products.find(x => x.id === id);
    setProducts(prev => prev.filter(x => x.id !== id));
    addToast('success', `Produit supprimé : ${p?.name}`);
  }, [products, addToast]);

  const adjustStock = useCallback((id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newQty = Math.max(0, p.qty + delta);
      const updated = { ...p, qty: newQty };
      addActivity(delta > 0 ? '#4361ee' : '#ef233c',
        `${delta > 0 ? `Ajout de ${delta}` : `Retrait de ${Math.abs(delta)}`} unité${Math.abs(delta) > 1 ? 's' : ''} — ${p.name}`);
      if (newQty === 0) addNotification('danger', `Rupture de stock : ${p.name}`);
      else if (newQty <= p.threshold) addNotification('warning', `Stock faible : ${p.name} (${newQty} unités)`);
      else addToast('success', `Stock mis à jour : ${p.name} → ${newQty} unités`);
      return updated;
    }));
  }, [addActivity, addNotification, addToast]);

  const restockProduct = useCallback((id, qty) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newQty = p.qty + qty;
      addActivity('#06d6a0', `Réapprovisionnement : +${qty} — ${p.name}`);
      addToast('success', `${qty} unités ajoutées — ${p.name} (total : ${newQty})`);
      return { ...p, qty: newQty };
    }));
  }, [addActivity, addToast]);

  return (
    <AppContext.Provider value={{
      isDark, toggleTheme,
      currentUser, setCurrentUser,
      products, getStatus,
      addProduct, updateProduct, deleteProduct, adjustStock, restockProduct,
      activities,
      notifications, addNotification, clearNotifications,
      toasts, addToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
