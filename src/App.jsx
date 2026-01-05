import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";

import AdminDashboard from "./pages/admin/Dashboard";
import AddKost from "./pages/admin/AddKost";
import EditKost from "./pages/admin/EditKost";

import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";
import AdminLayout from "./components/admin/AdminLayout";

import { kosts as initialKosts } from "./data/kosts";

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
  const [kosts, setKosts] = useState(initialKosts);

  const handleAdd = (newKost) => {
    const id = newKost?.id ?? crypto.randomUUID();
    setKosts((prev) => {
      if (prev.some((k) => String(k.id) === String(id))) return prev;
      return [{ ...newKost, id }, ...prev];
    });
  };

  const handleDelete = (id) => {
    setKosts((prev) => prev.filter((k) => String(k.id) !== String(id)));
  };

  const handleEdit = (updated) => {
    setKosts((prev) =>
      prev.map((k) => (String(k.id) === String(updated.id) ? updated : k))
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home kosts={kosts} />
          </PublicLayout>
        }
      />

      <Route
        path="/detail/:id"
        element={
          <PublicLayout>
            <KostDetail kosts={kosts} />
          </PublicLayout>
        }
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={<AdminDashboard kosts={kosts} onDelete={handleDelete} />}
        />
        <Route path="add" element={<AddKost onAdd={handleAdd} />} />
        <Route
          path="edit/:id"
          element={<EditKost kosts={kosts} onEdit={handleEdit} />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
    </Routes>
  );
}
