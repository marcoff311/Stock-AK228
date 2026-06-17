# 📊 Stock Management App - Avec Base de Données SQLite

Cette application de gestion des stocks utilise maintenant une **base de données SQLite** pour persister toutes les données.

## 🏗️ Architecture

- **Frontend**: React + Vite (port 5173)
- **Backend**: Express.js (port 3001)
- **Database**: SQLite (`stocks.db`)

## 🚀 Démarrage Rapide

### Option 1: Script de démarrage (Windows)
```bash
.\start.bat
```

### Option 2: Démarrage manuel

**Terminal 1 - Serveur backend:**
```bash
cd server
npm start
# Serveur actif sur http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend accessible sur http://localhost:5173
```

## 📦 Dépendances Installées

### Server (`server/`)
- `express` - Framework web
- `sqlite3` - Base de données
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - Parsing des requêtes JSON

### Client
- `react` - UI Framework
- `vite` - Build tool

## 🗄️ Schéma de la Base de Données

### Table: `products`
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- ref (TEXT UNIQUE)
- category (TEXT)
- quantity (INTEGER)
- threshold (INTEGER)
- price (REAL)
- supplier (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)
```

### Table: `activities`
```sql
- id (INTEGER PRIMARY KEY)
- color (TEXT)
- text (TEXT)
- time (DATETIME)
```

### Table: `notifications`
```sql
- id (INTEGER PRIMARY KEY)
- type (TEXT)
- text (TEXT)
- time (DATETIME)
```

### Table: `users`
```sql
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT)
- created_at (DATETIME)
```

## 🔌 API Endpoints

### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Activités
- `GET /api/activities` - Récupérer les activités
- `POST /api/activities` - Ajouter une activité

### Notifications
- `GET /api/notifications` - Récupérer les notifications
- `POST /api/notifications` - Ajouter une notification
- `DELETE /api/notifications` - Supprimer toutes les notifications

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription

## 📝 Utilisation

### 1. Ajouter un Produit
```javascript
POST /api/products
{
  "name": "iPhone 15 Pro",
  "ref": "APP-001",
  "category": "Électronique",
  "quantity": 50,
  "threshold": 10,
  "price": 850000,
  "supplier": "Apple Inc."
}
```

### 2. Mettre à Jour le Stock
```javascript
PUT /api/products/:id
{
  "quantity": 45
}
```

### 3. Enregistrer une Activité
```javascript
POST /api/activities
{
  "color": "#4361ee",
  "text": "Ajout de 50 unités — iPhone 15 Pro"
}
```

## 🔄 Synchronisation Frontend-Backend

Le frontend utilise l'API client (`src/api/apiClient.js`) pour:
- Charger les données au démarrage
- Synchroniser toutes les modifications en base de données
- Gérer les erreurs réseau (fallback aux données locales)

## 🛠️ Développement

### Ajouter une Nouvelle Route
1. Ajouter la route dans `server/server.js`
2. Ajouter la fonction API dans `src/api/apiClient.js`
3. Utiliser dans les composants React

### Modifier le Schéma de la BD
1. Éditer les requêtes CREATE TABLE dans `server/server.js`
2. Supprimer `stocks.db` (la BD sera recréée)
3. Redémarrer le serveur

## 📊 Avantages de la BD

✅ **Persistance**: Les données survivent aux redémarrages  
✅ **Sécurité**: Les données sont stockées localement  
✅ **Performance**: Récupération rapide des données  
✅ **Scalabilité**: Évolution facile vers PostgreSQL/MySQL  

## 🐛 Troubleshooting

### Port 3001 déjà utilisé
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Erreur de connexion à la BD
- Vérifier que `stocks.db` est accessible
- Vérifier les permissions du dossier `/server`
- Redémarrer le serveur

## 📚 Documentation Supplémentaire

- [Express.js Docs](https://expressjs.com/)
- [SQLite3 Docs](https://www.sqlite.org/docs.html)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
