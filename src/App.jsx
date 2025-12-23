import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { useState } from "react";
=======
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a

// Pages
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
<<<<<<< HEAD
import AdminDashboard from "./pages/admin/Dashboard";

// Data
import { initialKosts } from "./data/kosts";
=======
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a

// Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

<<<<<<< HEAD

/**
 * Layout untuk PUBLIC USER
=======
/**
 * Layout untuk PUBLIC USER
 * Navbar & Footer ditaruh di sini
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
 */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
<<<<<<< HEAD
      <main className="min-h-screen bg-slate-950 text-white">{children}</main>
=======
      <main className="min-h-screen bg-white text-slate-900">{children}</main>
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
      <Footer />
    </>
  );
}

<<<<<<< HEAD
/**
 * Layout untuk ADMIN
 */
function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-black">{children}</main>
    </>
  );
}

export default function App() {
  // ✅ State pusat (dipakai Public + Admin)
  const [kosts, setKosts] = useState(initialKosts);

  // ✅ Admin: tambah data (dummy)
  const onAdd = ({ name, type, price }) => {
    if (!name?.trim() || !price?.trim()) return;

    const newItem = {
      id: String(Date.now()),
      name,
      type,
      price: Number(price),
      // field lain opsional (boleh diabaikan CP1)
    };

    console.log("[ADD]", newItem);
    setKosts((prev) => [newItem, ...prev]);
  };

  // ✅ Admin: hapus data
  const onDelete = (item) => {
    console.log("[DELETE]", item);
    setKosts((prev) => prev.filter((k) => k.id !== item.id));
  };

  // ✅ Admin: edit (CP1 cukup log)
  const onEdit = (item) => {
    console.log("[EDIT] CP1 log:", item);
  };

=======
export default function App() {
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PublicLayout>
              {/* opsional: kirim kosts biar public sinkron */}
              <Home kosts={kosts} />
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
<<<<<<< HEAD

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard
                kosts={kosts}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </AdminLayout>
          }
        />
=======
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
      </Routes>
    </BrowserRouter>
  );
}
