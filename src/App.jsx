import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Kontak from "./pages/public/Kontak";
import Bantuan from "./pages/public/Bantuan";
import Privasi from "./pages/public/Privasi";
import Syarat from "./pages/public/Syarat";

import Login from "./pages/public/auth/Login";
import Signup from "./pages/public/auth/Signup";

import SettingsProfile from "./pages/profile/SettingsProfile";
import AdminRoutes from "./routes/AdminRoutes";

import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

import { KOSTS_ENDPOINT } from "./api/mockapi";

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
  const [kosts, setKosts] = useState([]);
  const [loadingKosts, setLoadingKosts] = useState(true);
  const [errorKosts, setErrorKosts] = useState("");

  const fetchKosts = async () => {
    try {
      setErrorKosts("");
      setLoadingKosts(true);

      const res = await fetch(KOSTS_ENDPOINT);
      if (!res.ok)
        throw new Error(`HTTP ${res.status} - gagal ambil data kost`);

      const data = await res.json();
      setKosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetchKosts error:", e);
      setErrorKosts(e?.message || "Gagal mengambil data kost");
      setKosts([]);
    } finally {
      setLoadingKosts(false);
    }
  };

  useEffect(() => {
    fetchKosts();
  }, []);

  const handleAdd = async (newKost) => {
    const res = await fetch(KOSTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newKost),
    });
    if (!res.ok) throw new Error("Gagal menambahkan kost");

    const created = await res.json();
    setKosts((prev) => [created, ...prev]);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${KOSTS_ENDPOINT}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus kost");

    setKosts((prev) => prev.filter((k) => String(k.id) !== String(id)));
  };

  const handleEdit = async (updated) => {
    const res = await fetch(`${KOSTS_ENDPOINT}/${updated.id}`, {
      method: "PUT", // atau PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error("Gagal mengubah kost");

    const saved = await res.json();
    setKosts((prev) =>
      prev.map((k) => (String(k.id) === String(saved.id) ? saved : k))
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <Home kosts={kosts} loading={loadingKosts} error={errorKosts} />
            }
          />
          <Route
            path="/detail/:id"
            element={
              <KostDetail
                kosts={kosts}
                loading={loadingKosts}
                error={errorKosts}
              />
            }
          />

          <Route path="/kontak" element={<Kontak />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/privasi" element={<Privasi />} />
          <Route path="/syarat" element={<Syarat />} />

          <Route path="/profile/settings" element={<SettingsProfile />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <AdminRoutes
              kosts={kosts}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={fetchKosts}
            />
          }
        />

        <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}