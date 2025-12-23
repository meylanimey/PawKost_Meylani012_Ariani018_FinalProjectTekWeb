import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Pages
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Dashboard from "./pages/admin/Dashboard";

// Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

// data awal (yang sekarang kamu pakai di KostDetail)
import { kosts as initialKosts } from "./data/kosts";

/**
 * Layout untuk PUBLIC USER
 * Navbar & Footer ditaruh di sini
 */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-slate-900">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  // ✅ Ini data yang akan dipakai Dashboard (bisa edit/hapus)
  const [kosts, setKosts] = useState(initialKosts);

  const handleAdd = (newKost) => {
    // pastikan ada id & tidak duplikat
    const id = newKost?.id ?? crypto.randomUUID();
    setKosts((prev) => {
      if (prev.some((k) => k.id === id)) return prev;
      return [{ ...newKost, id }, ...prev];
    });
  };

  const handleDelete = (id) => {
    setKosts((prev) => prev.filter((k) => k.id !== id));
  };

  const handleEdit = (updated) => {
    setKosts((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/detail/:id"
        element={
          <PublicLayout>
            <KostDetail />
          </PublicLayout>
        }
      />

      {/* ADMIN ROUTE */}
      <Route
        path="/dashboard"
        element={
          <Dashboard
            kosts={kosts}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      />
    </Routes>
  );
}
