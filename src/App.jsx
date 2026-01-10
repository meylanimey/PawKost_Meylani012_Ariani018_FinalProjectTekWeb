import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

// Pages (Public)
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Kontak from "./pages/public/Kontak";
import Bantuan from "./pages/public/Bantuan";
import Privasi from "./pages/public/Privasi";
import Syarat from "./pages/public/Syarat";

// Pages (Auth)
import Login from "./pages/public/auth/Login";
import Signup from "./pages/public/auth/Signup";

// Profile
import SettingsProfile from "./pages/profile/SettingsProfile";

// Admin (nested routes)
import AdminRoutes from "./routes/AdminRoutes";

// Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

// Seed data
import { Kosts } from "@/data/Kosts";

/* =======================
   LAYOUTS
======================= */

// Public layout → ADA navbar & footer
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

// Auth layout → TANPA navbar & footer + transisi
function AuthLayout() {
  const location = useLocation();

  return (
    <main className="min-h-screen">
      <div key={location.pathname} className="auth-page-enter">
        <Outlet />
      </div>

      <style>{`
        .auth-page-enter{
          animation: authIn .28s ease both;
        }
        @keyframes authIn{
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function App() {
  // ✅ FIX: kosts + handlers didefinisikan
  const [kosts, setKosts] = useState(() => Kosts ?? []);

  const handleAdd = (newKost) => setKosts((prev) => [newKost, ...prev]);

  const handleDelete = (id) =>
    setKosts((prev) => prev.filter((k) => String(k.id) !== String(id)));

  const handleEdit = (updated) =>
    setKosts((prev) =>
      prev.map((k) => (String(k.id) === String(updated.id) ? updated : k))
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH USER ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ================= PUBLIC + USER ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home kosts={kosts} />} />
          <Route path="/detail/:id" element={<KostDetail kosts={kosts} />} />

          <Route path="/kontak" element={<Kontak />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/privasi" element={<Privasi />} />
          <Route path="/syarat" element={<Syarat />} />

          {/* SETTINGS PROFILE */}
          <Route path="/profile/settings" element={<SettingsProfile />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/*"
          element={
            <AdminRoutes
              kosts={kosts}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
