<<<<<<< HEAD
import { useState } from "react";
import Dashboard from "@/pages/admin/Dashboard";
import { initialKosts } from "@/data/kosts";

export default function App() {
  const [kosts, setKosts] = useState(initialKosts);

  const onAdd = ({ name, type, price }) => {
    if (!name.trim() || !price.trim()) return;

    const newItem = {
      id: String(Date.now()),
      name,
      type,
      price: Number(price),
    };

    console.log("[ADD]", newItem);
    setKosts((prev) => [newItem, ...prev]);
  };

  const onDelete = (item) => {
    console.log("[DELETE]", item);
    setKosts((prev) => prev.filter((k) => k.id !== item.id));
  };

  const onEdit = (item) => {
    console.log("[EDIT] CP1 log saja:", item);
  };

  return <Dashboard kosts={kosts} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} />;
}
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";

// Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

/**
 * Layout untuk PUBLIC USER
 * Navbar & Footer ditaruh di sini
 */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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

        {/* ADMIN ROUTES (NANTI) */}
        {/*
        <Route path="/admin" element={<AdminDashboard />} />
        */}
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> a2bdc4a882deb7ba432e310a2a8a8d18646b9fa7
