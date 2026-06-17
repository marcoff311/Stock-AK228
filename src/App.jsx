import { useState } from "react";
import { useApp } from "./context/AppContext";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import ToastContainer from "./components/ToastContainer";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import { CategoriesPage, AlertsPage } from "./pages/OtherPages";

export default function App() {
  const { isDark, currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!currentUser) return <AuthPage />;

  const pages = {
    dashboard: <Dashboard setCurrentPage={setCurrentPage} />,
    inventory: <InventoryPage />,
    categories: <CategoriesPage setCurrentPage={setCurrentPage} />,
    alerts: <AlertsPage />,
  };

  return (
    <div style={{
      minHeight: '100vh', background: isDark ? '#0d1117' : '#f1f3f9',
      color: isDark ? '#e6edf3' : '#1a1a2e', fontFamily: 'system-ui,-apple-system,sans-serif',
      transition: 'all .3s'
    }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
        {pages[currentPage]}
      </main>
      <ToastContainer />
    </div>
  );
}
