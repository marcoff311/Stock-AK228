#!/bin/bash
# Démarrer le serveur backend et le frontend en parallèle

echo "📊 Démarrage de l'application Stocks..."
echo ""

# Démarrer le serveur backend dans un terminal
echo "🚀 Démarrage du serveur (http://localhost:3001)..."
cd server && npm install > /dev/null 2>&1 && npm start &
SERVER_PID=$!

# Attendre que le serveur soit prêt
sleep 2

# Démarrer le frontend
echo "⚡ Démarrage du frontend (http://localhost:5173)..."
npm install > /dev/null 2>&1 && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application démarrée!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 API: http://localhost:3001"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter..."

# Attendre l'arrêt
wait
