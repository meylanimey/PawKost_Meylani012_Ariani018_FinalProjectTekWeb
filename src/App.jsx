import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";


// ===== Pages (Public) =====
import Home from "./pages/public/Home";
import KostDetail from "./pages/public/KostDetail";
import Kontak from "./pages/public/Kontak";
import Bantuan from "./pages/public/Bantuan";
import Privasi from "./pages/public/Privasi";
import Syarat from "./pages/public/Syarat";


// ===== Components =====
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";


/**
 * Layout untuk PUBLIC USER
 * Navbar & Footer hanya didefinisikan sekali
 */
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
        {/*
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        */}
      </Routes>
    </BrowserRouter>
  );
}



