import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./stocks.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la BD:', err);
  } else {
    console.log('✅ Base de données SQLite connectée');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Table pour les produits
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ref TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      threshold INTEGER NOT NULL DEFAULT 5,
      price REAL NOT NULL,
      supplier TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table pour les activités
    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      color TEXT NOT NULL,
      text TEXT NOT NULL,
      time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table pour les notifications
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      text TEXT NOT NULL,
      time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table pour les utilisateurs
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// ==================== PRODUCTS ====================

// Récupérer tous les produits
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Récupérer un produit par ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(row);
  });
});

// Ajouter un nouveau produit
app.post('/api/products', (req, res) => {
  const { name, ref, category, quantity, threshold, price, supplier } = req.body;

  if (!name || !ref || !category || quantity === undefined || !price || !supplier) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  db.run(
    `INSERT INTO products (name, ref, category, quantity, threshold, price, supplier)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, ref, category, quantity, threshold, price, supplier],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        ref,
        category,
        quantity,
        threshold,
        price,
        supplier
      });
    }
  );
});

// Mettre à jour un produit
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, ref, category, quantity, threshold, price, supplier } = req.body;

  const updateFields = [];
  const updateValues = [];

  if (name !== undefined) {
    updateFields.push('name = ?');
    updateValues.push(name);
  }
  if (ref !== undefined) {
    updateFields.push('ref = ?');
    updateValues.push(ref);
  }
  if (category !== undefined) {
    updateFields.push('category = ?');
    updateValues.push(category);
  }
  if (quantity !== undefined) {
    updateFields.push('quantity = ?');
    updateValues.push(quantity);
  }
  if (threshold !== undefined) {
    updateFields.push('threshold = ?');
    updateValues.push(threshold);
  }
  if (price !== undefined) {
    updateFields.push('price = ?');
    updateValues.push(price);
  }
  if (supplier !== undefined) {
    updateFields.push('supplier = ?');
    updateValues.push(supplier);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateValues.push(id);

  const sql = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(sql, updateValues, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ id, message: 'Produit mis à jour' });
  });
});

// Supprimer un produit
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé' });
  });
});

// ==================== ACTIVITIES ====================

app.get('/api/activities', (req, res) => {
  db.all('SELECT * FROM activities ORDER BY time DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/activities', (req, res) => {
  const { color, text } = req.body;

  if (!color || !text) {
    return res.status(400).json({ error: 'Couleur et texte requis' });
  }

  db.run(
    'INSERT INTO activities (color, text) VALUES (?, ?)',
    [color, text],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        color,
        text
      });
    }
  );
});

// ==================== NOTIFICATIONS ====================

app.get('/api/notifications', (req, res) => {
  db.all('SELECT * FROM notifications ORDER BY time DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/notifications', (req, res) => {
  const { type, text } = req.body;

  if (!type || !text) {
    return res.status(400).json({ error: 'Type et texte requis' });
  }

  db.run(
    'INSERT INTO notifications (type, text) VALUES (?, ?)',
    [type, text],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        type,
        text
      });
    }
  );
});

app.delete('/api/notifications', (req, res) => {
  db.run('DELETE FROM notifications', [], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Toutes les notifications supprimées' });
  });
});

// ==================== USERS ====================

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiants manquants' });
  }

  db.get(
    'SELECT id, username FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }
      res.json({ id: user.id, username: user.username });
    }
  );
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiants manquants' });
  }

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Utilisateur déjà existant' });
      }
      res.status(201).json({ id: this.lastID, username });
    }
  );
});

// ==================== DÉMARRAGE DU SERVEUR ====================

app.listen(port, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${port}`);
  console.log('📊 API disponible sur http://localhost:${port}/api/*\n');
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err);
    }
    console.log('\n✅ Base de données fermée');
    process.exit(0);
  });
});
