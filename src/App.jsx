import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Public pages
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Kontak from "./pages/public/Kontak";
import Bantuan from "./pages/public/Bantuan";
import Privasi from "./pages/public/Privasi";
import Syarat from "./pages/public/Syarat";

// Auth user
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Profile
import SettingsProfile from "./pages/profile/SettingsProfile";

// Admin
import AdminLogin from "./pages/admin/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AddKost from "./pages/admin/AddKost";
import EditKost from "./pages/admin/EditKost";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER / PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/kost/:id" element={<KostDetail />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/privasi" element={<Privasi />} />
          <Route path="/syarat" element={<Syarat />} />
          <Route path="/profile/settings" element={<SettingsProfile />} />
        </Route>

        {/* AUTH USER */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-kost" element={<AddKost />} />
          <Route path="edit-kost/:id" element={<EditKost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
