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
