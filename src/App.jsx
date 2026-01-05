import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";

// ===== Pages (Public) =====
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Kontak from "./pages/public/Kontak";
import Bantuan from "./pages/public/Bantuan";
import Privasi from "./pages/public/Privasi";
import Syarat from "./pages/public/Syarat";

// ===== Pages (Admin) =====
import Dashboard from "./pages/admin/Dashboard";
import AddKost from "./pages/admin/AddKost";
import EditKost from "./pages/admin/EditKost";

// ===== Components =====
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";
import AdminLayout from "./components/admin/AdminLayout";

// Seed data
import { Kosts } from "@/data/Kosts";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [kosts, setKosts] = useState(() => Kosts ?? []);

  const handleAdd = (newKost) => {
    setKosts((prev) => [newKost, ...prev]);
  };

  const handleDelete = (id) => {
    setKosts((prev) => prev.filter((k) => String(k.id) !== String(id)));
  };

  // ✅ rapih: terima 1 objek updated dari EditKost
  const handleEdit = (updated) => {
    setKosts((prev) =>
      prev.map((k) => (String(k.id) === String(updated.id) ? updated : k))
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<KostDetail />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/privasi" element={<Privasi />} />
          <Route path="/syarat" element={<Syarat />} />
        </Route>

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Dashboard kosts={kosts} onDelete={handleDelete} />}
          />
          <Route path="add" element={<AddKost onAdd={handleAdd} />} />
          <Route path="edit/:id" element={<EditKost kosts={kosts} onEdit={handleEdit} />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
