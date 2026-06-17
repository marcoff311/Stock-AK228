# 📊 Stock Management Application - Stocks-AK228

Une application web moderne et complète de **gestion des stocks** construite avec **React**, **Vite**, **Express.js** et **SQLite**.

## ✨ Fonctionnalités

### 📦 Gestion des Produits
- ➕ Ajouter de nouveaux produits avec référence unique
- ✏️ Modifier les détails (nom, catégorie, prix, fournisseur)
- 🗑️ Supprimer les produits
- 🔍 Filtrer et chercher des produits
- 📊 Affichage des statuts de stock (En stock, Stock faible, Rupture)

### 📈 Gestion du Stock
- ⬆️ Augmenter/Diminuer les quantités
- 🔔 Alertes de stock faible et ruptures
- 📋 Historique des mouvements de stock
- 🎯 Seuils configurables par produit

### 🏷️ Catégories et Filtres
- Électronique 💻
- Vêtements 👕
- Alimentation 🥗
- Mobilier 🪑
- Outils 🔧

### 📊 Tableau de Bord
- Vue d'ensemble des stocks
- Statistiques rapides
- Activités récentes
- Notifications en temps réel

### 🌙 Interface Moderne
- Mode clair/sombre
- Design responsive
- Animations fluides
- Notifications toast

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/marcoff311/Stock-AK228.git
cd Stock-AK228
```

2. **Installer les dépendances**
```bash
npm install
cd server && npm install && cd ..
```

3. **Démarrer l'application**

**Windows:**
```bash
.\start.bat
```

**Linux/Mac:**
```bash
bash start.sh
```

**Manuel - Terminal 1 (Serveur):**
```bash
cd server
npm start
```

**Manuel - Terminal 2 (Frontend):**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Architecture

```
Stock-AK228/
├── src/                    # Code React
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages principales
│   ├── context/          # Context API (AppContext)
│   ├── api/              # Client API
│   └── data/             # Données initiales
├── server/               # Backend Express.js
│   ├── server.js         # Serveur principal
│   ├── stocks.db         # Base de données SQLite
│   └── package.json      # Dépendances serveur
├── public/              # Ressources statiques
├── index.html          # Point d'entrée HTML
└── package.json        # Dépendances frontend
```

## 🔌 Stack Technique

### Frontend
- **React 18.3** - Framework UI
- **Vite 5.4** - Build tool ultra-rapide
- **JavaScript ES6+** - Modern JavaScript

### Backend
- **Express.js 4.18** - Framework Node.js
- **SQLite3 5.1** - Base de données
- **CORS** - Cross-Origin Resource Sharing

### Base de Données
- **SQLite** - Léger, sans serveur, portable
- **4 Tables** : products, activities, notifications, users

## 📚 Documentation

Pour plus de détails sur la base de données et l'API:
👉 Voir [DATABASE.md](./DATABASE.md)

## 🔌 Endpoints API

### Produits
- `GET /api/products` - Lister tous les produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Mettre à jour
- `DELETE /api/products/:id` - Supprimer

### Activités & Notifications
- `GET /api/activities` - Historique
- `GET /api/notifications` - Notifications
- `POST /api/activities|notifications` - Ajouter

### Auth
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription

## 🎨 Thème et Style

- Couleurs cohérentes par catégorie
- Mode sombre/clair avec sauvegarde
- Animations CSS fluides
- Design mobile-first

## 📊 Données Exemple

L'application inclut des données d'exemple (électronique, vêtements, alimentation, etc.) qui sont automatiquement chargées au démarrage.

## 🔒 Sécurité

- ✅ Authentification basique
- ✅ Données locales (SQLite)
- ✅ CORS configuré
- ⚠️ Note: Implémenter JWT pour la production

## 🐛 Troubleshooting

### Port déjà utilisé
```bash
# Vérifier les processus
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

### Erreur de connexion à la BD
- Supprimer `server/stocks.db`
- Redémarrer le serveur (il recréera la BD)

### CORS errors
- Vérifier que le serveur tourne sur `http://localhost:3001`
- Vérifier les headers CORS dans `server/server.js`

## 📈 Améliorations Futures

- [ ] Authentification JWT sécurisée
- [ ] Pagination et recherche avancée
- [ ] Export PDF/Excel
- [ ] Rapports statistiques
- [ ] Gestion des fournisseurs
- [ ] Prévisions de stock
- [ ] Intégration d'un ORM (Prisma)
- [ ] Tests unitaires et E2E

## 🤝 Contribution

Les contributions sont bienvenues! 
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Auteur

**Stock-AK228** - Application de gestion des stocks moderne

## 📞 Support

Pour des questions ou des problèmes, ouvrir une issue sur GitHub.

---

**Fait avec ❤️ pour optimiser la gestion des stocks**

