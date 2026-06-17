const API_BASE = 'http://localhost:3001/api';

// ==================== PRODUCTS ====================

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) throw new Error('Erreur lors de la récupération du produit');
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Erreur lors de la création du produit');
  return response.json();
}

export async function updateProduct(id, updates) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du produit');
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du produit');
  return response.json();
}

// ==================== ACTIVITIES ====================

export async function fetchActivities() {
  const response = await fetch(`${API_BASE}/activities`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des activités');
  return response.json();
}

export async function addActivity(color, text) {
  const response = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ color, text }),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'activité');
  return response.json();
}

// ==================== NOTIFICATIONS ====================

export async function fetchNotifications() {
  const response = await fetch(`${API_BASE}/notifications`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des notifications');
  return response.json();
}

export async function addNotification(type, text) {
  const response = await fetch(`${API_BASE}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, text }),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'ajout de la notification');
  return response.json();
}

export async function clearNotifications() {
  const response = await fetch(`${API_BASE}/notifications`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression des notifications');
  return response.json();
}

// ==================== USERS ====================

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Identifiants invalides');
  return response.json();
}

export async function registerUser(username, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'inscription');
  return response.json();
}
