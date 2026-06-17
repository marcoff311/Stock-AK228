import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { initialProducts, initialActivities, initialNotifications } from "../data/initialData";
import * as api from "../api/apiClient";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données depuis la BD au démarrage
  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  const loadDataFromDatabase = async () => {
    try {
      setIsLoading(true);
      const [productsData, activitiesData, notificationsData] = await Promise.all([
        api.fetchProducts(),
        api.fetchActivities(),
        api.fetchNotifications(),
      ]);
      setProducts(productsData);
      setActivities(activitiesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.warn('Impossible de charger depuis la BD, utilisation des données locales:', error);
      // Les données initiales restent chargées
    } finally {
      setIsLoading(false);
    }
  };

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
    const addToDBAndLocalState = async () => {
      try {
        await api.addNotification(type, text);
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const id = Date.now();
        setNotifications(n => [{ id, type, text, time }, ...n]);
        addToast(type, text);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la notification:', error);
        addToast(type, text);
      }
    };
    addToDBAndLocalState();
  }, [addToast]);

  const clearNotifications = () => {
    const clearFromDB = async () => {
      try {
        await api.clearNotifications();
        setNotifications([]);
      } catch (error) {
        console.error('Erreur lors de la suppression des notifications:', error);
      }
    };
    clearFromDB();
  };

  const addActivity = useCallback((color, text) => {
    const addToDBAndLocalState = async () => {
      try {
        await api.addActivity(color, text);
        const id = Date.now();
        setActivities(a => [{ id, color, text, time: "À l'instant" }, ...a.slice(0, 9)]);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'activité:', error);
      }
    };
    addToDBAndLocalState();
  }, []);

  const getStatus = (p) => {
    if (p.qty === 0) return 'Rupture';
    if (p.qty <= p.threshold) return 'Stock faible';
    return 'En stock';
  };

  const addProduct = useCallback((data) => {
    const addToDBAndLocalState = async () => {
      try {
        const newProduct = await api.createProduct({
          name: data.name,
          ref: data.ref,
          category: data.category,
          quantity: data.qty,
          threshold: data.threshold,
          price: data.price,
          supplier: data.supplier,
        });
        
        const product = {
          id: newProduct.id,
          name: newProduct.name,
          ref: newProduct.ref,
          cat: newProduct.category,
          qty: newProduct.quantity,
          threshold: newProduct.threshold,
          price: newProduct.price,
          supplier: newProduct.supplier,
        };
        
        setProducts(prev => [product, ...prev]);
        
        // Appels API pour activités et notifications
        try {
          await api.addActivity('#7209b7', `Nouveau produit ajouté — ${product.name}`);
        } catch (e) { console.error(e); }
        
        if (product.qty === 0) {
          await api.addNotification('danger', `Rupture de stock : ${product.name} (0 unité)`);
        } else if (product.qty <= product.threshold) {
          await api.addNotification('warning', `Stock faible : ${product.name} (${product.qty} unités)`);
        } else {
          addToast('success', `Produit ajouté : ${product.name}`);
        }
      } catch (error) {
        addToast('danger', 'Erreur lors de l\'ajout du produit');
        console.error(error);
      }
    };
    addToDBAndLocalState();
  }, [addToast]);

  const updateProduct = useCallback((id, data) => {
    const updateInDBAndLocalState = async () => {
      try {
        await api.updateProduct(id, {
          name: data.name,
          ref: data.ref,
          category: data.cat,
          quantity: data.qty,
          threshold: data.threshold,
          price: data.price,
          supplier: data.supplier,
        });
        
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        addToast('success', `Produit mis à jour : ${data.name}`);
      } catch (error) {
        addToast('danger', 'Erreur lors de la mise à jour');
        console.error(error);
      }
    };
    updateInDBAndLocalState();
  }, [addToast]);

  const deleteProduct = useCallback((id) => {
    const deleteFromDBAndLocalState = async () => {
      try {
        const p = products.find(x => x.id === id);
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(x => x.id !== id));
        addToast('success', `Produit supprimé : ${p?.name}`);
      } catch (error) {
        addToast('danger', 'Erreur lors de la suppression');
        console.error(error);
      }
    };
    deleteFromDBAndLocalState();
  }, [products, addToast]);

  const adjustStock = useCallback((id, delta) => {
    const adjustInDB = async () => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      
      try {
        const newQty = Math.max(0, p.qty + delta);
        await api.updateProduct(id, { quantity: newQty });
        
        setProducts(prev => prev.map(prod => {
          if (prod.id !== id) return prod;
          return { ...prod, qty: newQty };
        }));
        
        const activityMsg = `${delta > 0 ? `Ajout de ${delta}` : `Retrait de ${Math.abs(delta)}`} unité${Math.abs(delta) > 1 ? 's' : ''} — ${p.name}`;
        const activityColor = delta > 0 ? '#4361ee' : '#ef233c';
        
        try {
          await api.addActivity(activityColor, activityMsg);
        } catch (e) { console.error(e); }
        
        if (newQty === 0) {
          await api.addNotification('danger', `Rupture de stock : ${p.name}`);
        } else if (newQty <= p.threshold) {
          await api.addNotification('warning', `Stock faible : ${p.name} (${newQty} unités)`);
        } else {
          addToast('success', `Stock mis à jour : ${p.name} → ${newQty} unités`);
        }
      } catch (error) {
        addToast('danger', 'Erreur lors de l\'ajustement du stock');
        console.error(error);
      }
    };
    adjustInDB();
  }, [products, addToast]);

  const restockProduct = useCallback((id, qty) => {
    const restockInDB = async () => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      
      try {
        const newQty = p.qty + qty;
        await api.updateProduct(id, { quantity: newQty });
        
        setProducts(prev => prev.map(prod => {
          if (prod.id !== id) return prod;
          return { ...prod, qty: newQty };
        }));
        
        try {
          await api.addActivity('#06d6a0', `Réapprovisionnement : +${qty} — ${p.name}`);
        } catch (e) { console.error(e); }
        
        addToast('success', `${qty} unités ajoutées — ${p.name} (total : ${newQty})`);
      } catch (error) {
        addToast('danger', 'Erreur lors du réapprovisionnement');
        console.error(error);
      }
    };
    restockInDB();
  }, [products, addToast]);

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
