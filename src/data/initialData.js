export const initialProducts = [
  { id: 1, name: 'iPhone 15 Pro', ref: 'APP-001', cat: 'Électronique', qty: 0, threshold: 10, price: 850000, supplier: 'Apple Inc.' },
  { id: 2, name: 'Samsung Galaxy S24', ref: 'SAM-002', cat: 'Électronique', qty: 45, threshold: 15, price: 620000, supplier: 'Samsung' },
  { id: 3, name: 'Laptop Dell XPS 13', ref: 'DEL-003', cat: 'Électronique', qty: 22, threshold: 10, price: 980000, supplier: 'Dell Technologies' },
  { id: 4, name: 'Casque Sony WH-1000XM5', ref: 'SON-004', cat: 'Électronique', qty: 3, threshold: 8, price: 280000, supplier: 'Sony' },
  { id: 5, name: 'Chaise ErgoMax Pro', ref: 'ERG-005', cat: 'Mobilier', qty: 2, threshold: 5, price: 185000, supplier: 'OfficeMax' },
  { id: 6, name: 'T-Shirt Premium Coton', ref: 'VET-006', cat: 'Vêtements', qty: 120, threshold: 20, price: 12500, supplier: 'TextilePro' },
  { id: 7, name: 'Jean Slim Fit', ref: 'VET-007', cat: 'Vêtements', qty: 67, threshold: 15, price: 35000, supplier: 'DenimCo' },
  { id: 8, name: 'Riz Basmati 5kg', ref: 'ALI-008', cat: 'Alimentation', qty: 8, threshold: 25, price: 8500, supplier: 'GrainMaster' },
  { id: 9, name: 'Bureau Standing', ref: 'MOB-009', cat: 'Mobilier', qty: 14, threshold: 5, price: 425000, supplier: 'FurniturePro' },
  { id: 10, name: 'Perceuse Bosch 800W', ref: 'OUT-010', cat: 'Outils', qty: 0, threshold: 5, price: 95000, supplier: 'Bosch' },
  { id: 11, name: 'AirPods Pro 3', ref: 'APP-011', cat: 'Électronique', qty: 35, threshold: 12, price: 195000, supplier: 'Apple Inc.' },
  { id: 12, name: 'Huile Olive 1L', ref: 'ALI-012', cat: 'Alimentation', qty: 4, threshold: 30, price: 6500, supplier: 'OliveGold' },
];

export const initialActivities = [
  { id: 1, color: '#4361ee', text: 'Ajout de 50 unités — Laptop Dell XPS 13', time: '10:32' },
  { id: 2, color: '#06d6a0', text: 'Commande reçue — 20× Souris Logitech MX Master', time: '09:15' },
  { id: 3, color: '#ef233c', text: 'Rupture détectée — iPhone 15 Pro', time: '08:47' },
  { id: 4, color: '#ffd166', text: 'Alerte seuil — Casque Sony WH (3 restants)', time: '08:30' },
  { id: 5, color: '#7209b7', text: 'Nouveau produit ajouté — AirPods Pro 3', time: 'Hier' },
];

export const initialNotifications = [
  { id: 1, type: 'danger', text: 'Rupture de stock : iPhone 15 Pro (0 unités)', time: 'Il y a 5 min' },
  { id: 2, type: 'warning', text: 'Stock faible : Casque Sony WH-1000XM5 (3 unités)', time: 'Il y a 22 min' },
  { id: 3, type: 'warning', text: 'Stock faible : Chaise ErgoMax (2 unités)', time: 'Il y a 1h' },
];

export const CATEGORIES = ['Électronique', 'Vêtements', 'Alimentation', 'Mobilier', 'Outils'];

export const CAT_ICONS = {
  'Électronique': '💻',
  'Vêtements': '👕',
  'Alimentation': '🥗',
  'Mobilier': '🪑',
  'Outils': '🔧',
};

export const CAT_COLORS = {
  'Électronique': '#4361ee',
  'Vêtements': '#7209b7',
  'Alimentation': '#06d6a0',
  'Mobilier': '#f59f00',
  'Outils': '#ef233c',
};
