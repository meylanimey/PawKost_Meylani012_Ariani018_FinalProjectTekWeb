import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [openCari, setOpenCari] = useState(false);
  const [openLainnya, setOpenLainnya] = useState(false);

  const cariRef = useRef(null);
  const lainnyaRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cariRef.current && !cariRef.current.contains(e.target)) {
        setOpenCari(false);
      }
      if (lainnyaRef.current && !lainnyaRef.current.contains(e.target)) {
        setOpenLainnya(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const goPage = (path) => {
    setOpenCari(false);
    setOpenLainnya(false);

    if (location.pathname === path) {
      scrollTop();
    } else {
      navigate(path);
      setTimeout(scrollTop, 200);
    }
  };

  const goHome = () => goPage("/");

  const goToSection = (id) => {
    setOpenCari(false);
    setOpenLainnya(false);

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname === "/") {
      setTimeout(scroll, 60);
    } else {
      navigate("/");
      setTimeout(scroll, 260);
    }
  };

  const baseLink =
    "font-medium text-[#8B6F47] hover:text-[#6B4423] transition-colors px-2 py-1";
  const activeLink = "text-[#6B4423]";

  const isActivePath = (path) => location.pathname === path;

  return (
<<<<<<< Updated upstream
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-bold tracking-tight">
            <span className="text-pink-600 font-bold">PAW</span>
            <span className="text-slate-900 font-regular">KOST</span>
          </Link>

          <span className="hidden text-sm text-slate-500 md:inline">
            Temukan kost impianmu
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Desktop Menu */}
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#katalog"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Katalog
            </a>
            <a
              href="#kontak"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Kontak
            </a>
          </nav>

          {/* Masuk (dummy, CP1) */}
=======
    <header className="bg-[#EFE4D0] shadow-sm border-b border-[#E5D5C0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2"
        >
          <img
            src="/logo-pawkost.png"
            alt="PAWKOST"
            className="w-14 h-14 object-contain"
          />
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-[#6F4417]">PAW</span>
            <span className="text-3xl font-normal text-[#8F6753]">KOST</span>
          </div>
        </button>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-6 ml-auto mr-2">
          {/* BERANDA */}
>>>>>>> Stashed changes
          <button
            type="button"
            onClick={goHome}
            className={`${baseLink} ${isActivePath("/") ? activeLink : ""}`}
          >
            Beranda
          </button>

<<<<<<< Updated upstream
          {/* Hamburger */}
=======
          {/* DROPDOWN CARI KOST */}
          <div ref={cariRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenCari((v) => !v);
                setOpenLainnya(false);
              }}
              className={`${baseLink} flex items-center gap-1.5`}
            >
              Cari Kost
              <ChevronDown rotated={openCari} />
            </button>

            <Dropdown open={openCari} align="left">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => goToSection("pilihan-kost")}
              >
                Pilihan Kost
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => goToSection("rekomendasi-kost")}
              >
                Rekomendasi Kost
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => goToSection("kost-kampus")}
              >
                Kost Area Kampus
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => goToSection("kost-hemat")}
              >
                Kost Hemat
              </button>
            </Dropdown>
          </div>

          {/* KONTAK */}
>>>>>>> Stashed changes
          <button
            type="button"
            onClick={() => goPage("/kontak")}
            className={`${baseLink} ${
              isActivePath("/kontak") ? activeLink : ""
            }`}
          >
            Kontak
          </button>

          {/* DROPDOWN LAINNYA */}
          <div ref={lainnyaRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenLainnya((v) => !v);
                setOpenCari(false);
              }}
              className={`${baseLink} flex items-center gap-1.5`}
            >
              Lainnya
              <ChevronDown rotated={openLainnya} />
            </button>

            <Dropdown open={openLainnya} align="right">
              <button
                type="button"
                className={`dropdown-item ${
                  isActivePath("/bantuan") ? "dropdown-active" : ""
                }`}
                onClick={() => goPage("/bantuan")}
              >
                Pusat Bantuan
              </button>

              <button
                type="button"
                className={`dropdown-item ${
                  isActivePath("/privasi") ? "dropdown-active" : ""
                }`}
                onClick={() => goPage("/privasi")}
              >
                Kebijakan Privasi
              </button>

              <button
                type="button"
                className={`dropdown-item ${
                  isActivePath("/syarat") ? "dropdown-active" : ""
                }`}
                onClick={() => goPage("/syarat")}
              >
                Syarat &amp; Ketentuan
              </button>
            </Dropdown>
          </div>
        </nav>

        {/* CTA */}
        <Link
          to="/login"
          className="
            border-2 border-[#8B4513] bg-white
            px-5 py-2 rounded-md text-sm font-semibold
            text-[#8B4513]
            hover:bg-[#8B4513] hover:text-white
            transition-all
            active:scale-[0.98]
          "
          onClick={scrollTop}
        >
          Login/Sign Up
        </Link>
      </div>

<<<<<<< Updated upstream
      {/* Dropdown Hamburger (PUBLIC ONLY) */}
      {open && (
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-3 space-y-1">
            <a
              href="#katalog"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Katalog
            </a>
            <a
              href="#kontak"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Kontak
            </a>
          </div>
        </div>
      )}
=======
      {/* Styles dropdown supaya button & link konsisten */}
      <style>{`
        .dropdown-item {
          width: 100%;
          display: block;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          background: transparent;
          border: 0;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .dropdown-item:hover {
          background: #f9fafb;
          color: #0f172a;
        }
        .dropdown-active {
          background: #f3f4f6;
          color: #0f172a;
        }
      `}</style>
>>>>>>> Stashed changes
    </header>
  );
}

function Dropdown({ open, align, children }) {
  return (
    <div
      className={[
        "absolute top-full mt-2 z-50",
        align === "right" ? "right-0" : "left-0",
        "w-56 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden",
        "transition-all duration-200 origin-top",
        open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ChevronDown({ rotated }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={`transition-transform ${rotated ? "rotate-180" : ""}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 8L2 4h8L6 8z" />
    </svg>
  );
}