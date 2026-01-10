import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, getSession, logout, onAuthChange } from "@/lib/auth";

export default function Navbar() {
  const [openCari, setOpenCari] = useState(false);
  const [openLainnya, setOpenLainnya] = useState(false);

  const [openMobile, setOpenMobile] = useState(false);
  const [openCariMobile, setOpenCariMobile] = useState(false);
  const [openLainnyaMobile, setOpenLainnyaMobile] = useState(false);

  const [openUser, setOpenUser] = useState(false);

  const cariRef = useRef(null);
  const lainnyaRef = useRef(null);
  const userRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(() => getSession());
  const [me, setMe] = useState(() => getCurrentUser());

  // ====== SYNC AUTH (TAB SAMA + TAB LAIN) ======
  useEffect(() => {
    const sync = () => {
      setSession(getSession());
      setMe(getCurrentUser());
    };

    // initial
    sync();

    // tab lain
    const onStorage = () => sync();
    window.addEventListener("storage", onStorage);

    // tab yang sama (login/logout/update profile)
    const off = onAuthChange(sync);

    return () => {
      window.removeEventListener("storage", onStorage);
      off();
    };
  }, []);

  // close menus on route change
  useEffect(() => {
    setOpenCari(false);
    setOpenLainnya(false);
    setOpenUser(false);

    setOpenMobile(false);
    setOpenCariMobile(false);
    setOpenLainnyaMobile(false);
  }, [location.pathname]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  // close dropdowns when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cariRef.current && !cariRef.current.contains(e.target)) setOpenCari(false);
      if (lainnyaRef.current && !lainnyaRef.current.contains(e.target)) setOpenLainnya(false);
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const closeAllMenus = () => {
    setOpenCari(false);
    setOpenLainnya(false);
    setOpenUser(false);

    setOpenMobile(false);
    setOpenCariMobile(false);
    setOpenLainnyaMobile(false);
  };

  const goPage = (path) => {
    closeAllMenus();
    if (location.pathname === path) {
      scrollTop();
    } else {
      navigate(path);
      setTimeout(scrollTop, 150);
    }
  };

  const goHome = () => goPage("/");

  const goToSection = (id) => {
    closeAllMenus();

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

  const avatarSrc = me?.avatar || "/images/cat.png";

  const handleLogout = () => {
    logout(); // auth.ts akan emitAuthChange(), navbar auto update
    goHome();
  };

  return (
    <header className="bg-[#EFE4D0] shadow-sm border-b border-[#E5D5C0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <button type="button" onClick={goHome} className="flex items-center gap-2">
          <img
            src="/logo-pawkost.png"
            alt="PAWKOST"
            className="w-14 h-14 object-contain"
            draggable={false}
          />
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-[#6F4417]">PAW</span>
            <span className="text-3xl font-normal text-[#8F6753]">KOST</span>
          </div>
        </button>

        {/* HAMBURGER (MOBILE) */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2
                     text-[#6B4423] hover:bg-[#E5D5C0] transition"
          aria-label="Toggle menu"
          aria-expanded={openMobile}
          onClick={() => setOpenMobile((v) => !v)}
        >
          {openMobile ? <IconX /> : <IconHamburger />}
        </button>

        {/* NAV (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-6 ml-auto mr-2">
          <button
            type="button"
            onClick={goHome}
            className={`${baseLink} ${isActivePath("/") ? activeLink : ""}`}
          >
            Beranda
          </button>

          {/* CARI KOST */}
          <div ref={cariRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenCari((v) => !v);
                setOpenLainnya(false);
                setOpenUser(false);
              }}
              className={`${baseLink} flex items-center gap-1.5`}
            >
              Cari Kost
              <ChevronDown rotated={openCari} />
            </button>

            <Dropdown open={openCari} align="left">
              <button type="button" className="dropdown-item" onClick={() => goToSection("pilihan-kost")}>
                Pilihan Kost
              </button>
              <button type="button" className="dropdown-item" onClick={() => goToSection("rekomendasi-kost")}>
                Rekomendasi Kost
              </button>
              <button type="button" className="dropdown-item" onClick={() => goToSection("kost-kampus")}>
                Kost Area Kampus
              </button>
              <button type="button" className="dropdown-item" onClick={() => goToSection("kost-hemat")}>
                Kost Hemat
              </button>
            </Dropdown>
          </div>

          <button
            type="button"
            onClick={() => goPage("/kontak")}
            className={`${baseLink} ${isActivePath("/kontak") ? activeLink : ""}`}
          >
            Kontak
          </button>

          {/* LAINNYA */}
          <div ref={lainnyaRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenLainnya((v) => !v);
                setOpenCari(false);
                setOpenUser(false);
              }}
              className={`${baseLink} flex items-center gap-1.5`}
            >
              Lainnya
              <ChevronDown rotated={openLainnya} />
            </button>

            <Dropdown open={openLainnya} align="right">
              <button
                type="button"
                className={`dropdown-item ${isActivePath("/bantuan") ? "dropdown-active" : ""}`}
                onClick={() => goPage("/bantuan")}
              >
                Pusat Bantuan
              </button>
              <button
                type="button"
                className={`dropdown-item ${isActivePath("/privasi") ? "dropdown-active" : ""}`}
                onClick={() => goPage("/privasi")}
              >
                Kebijakan Privasi
              </button>
              <button
                type="button"
                className={`dropdown-item ${isActivePath("/syarat") ? "dropdown-active" : ""}`}
                onClick={() => goPage("/syarat")}
              >
                Syarat &amp; Ketentuan
              </button>
            </Dropdown>
          </div>
        </nav>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:block">
          {!session ? (
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
          ) : (
            <div ref={userRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenCari(false);
                  setOpenLainnya(false);
                }}
                className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow border border-[#E5D5C0]
                           hover:brightness-95 transition"
              >
                {/* PP BULAT */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D9C3AF] bg-white flex-shrink-0">
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                </div>

                <div className="font-semibold text-[#6B4423] max-w-[140px] truncate">
                  {me?.name || "User"}
                </div>

                <ChevronDown rotated={openUser} />
              </button>

              <Dropdown open={openUser} align="right">
                <button type="button" className="dropdown-item" onClick={() => goPage("/profile/settings")}>
                  Settings Profile
                </button>
                <button type="button" className="dropdown-item text-red-600" onClick={handleLogout}>
                  Logout
                </button>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={[
          "md:hidden",
          "transition-all duration-200",
          openMobile ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
          "overflow-hidden border-t border-[#E5D5C0] bg-[#EFE4D0]",
        ].join(" ")}
      >
        <div className="px-6 py-4 space-y-2">
          <button type="button" onClick={goHome} className={`mobile-link ${isActivePath("/") ? "mobile-active" : ""}`}>
            Beranda
          </button>

          <div className="mobile-group">
            <button
              type="button"
              className="mobile-link flex items-center justify-between"
              onClick={() => {
                setOpenCariMobile((v) => !v);
                setOpenLainnyaMobile(false);
              }}
            >
              <span>Cari Kost</span>
              <ChevronDown rotated={openCariMobile} />
            </button>

            <div
              className={[
                "pl-3 mt-1 space-y-1 overflow-hidden transition-all duration-200",
                openCariMobile ? "max-h-60 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <button type="button" className="mobile-sub" onClick={() => goToSection("pilihan-kost")}>
                Pilihan Kost
              </button>
              <button type="button" className="mobile-sub" onClick={() => goToSection("rekomendasi-kost")}>
                Rekomendasi Kost
              </button>
              <button type="button" className="mobile-sub" onClick={() => goToSection("kost-kampus")}>
                Kost Area Kampus
              </button>
              <button type="button" className="mobile-sub" onClick={() => goToSection("kost-hemat")}>
                Kost Hemat
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goPage("/kontak")}
            className={`mobile-link ${isActivePath("/kontak") ? "mobile-active" : ""}`}
          >
            Kontak
          </button>

          <div className="mobile-group">
            <button
              type="button"
              className="mobile-link flex items-center justify-between"
              onClick={() => {
                setOpenLainnyaMobile((v) => !v);
                setOpenCariMobile(false);
              }}
            >
              <span>Lainnya</span>
              <ChevronDown rotated={openLainnyaMobile} />
            </button>

            <div
              className={[
                "pl-3 mt-1 space-y-1 overflow-hidden transition-all duration-200",
                openLainnyaMobile ? "max-h-60 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <button type="button" className={`mobile-sub ${isActivePath("/bantuan") ? "mobile-sub-active" : ""}`} onClick={() => goPage("/bantuan")}>
                Pusat Bantuan
              </button>
              <button type="button" className={`mobile-sub ${isActivePath("/privasi") ? "mobile-sub-active" : ""}`} onClick={() => goPage("/privasi")}>
                Kebijakan Privasi
              </button>
              <button type="button" className={`mobile-sub ${isActivePath("/syarat") ? "mobile-sub-active" : ""}`} onClick={() => goPage("/syarat")}>
                Syarat &amp; Ketentuan
              </button>
            </div>
          </div>

          <div className="pt-3">
            {!session ? (
              <Link
                to="/login"
                className="
                  block text-center w-full
                  border-2 border-[#8B4513] bg-white
                  px-5 py-2 rounded-md text-sm font-semibold
                  text-[#8B4513]
                  hover:bg-[#8B4513] hover:text-white
                  transition-all active:scale-[0.98]
                "
                onClick={() => {
                  closeAllMenus();
                  scrollTop();
                }}
              >
                Login/Sign Up
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/profile/settings"
                  className="
                    block text-center w-full
                    border-2 border-[#8B4513] bg-white
                    px-5 py-2 rounded-md text-sm font-semibold
                    text-[#8B4513]
                    hover:bg-[#8B4513] hover:text-white
                    transition-all active:scale-[0.98]
                  "
                  onClick={() => {
                    closeAllMenus();
                    scrollTop();
                  }}
                >
                  Settings Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full border-2 border-gray-900 bg-gray-900
                    px-5 py-2 rounded-md text-sm font-semibold
                    text-white hover:bg-black hover:border-black
                    transition-all active:scale-[0.98]
                  "
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
        .dropdown-item:hover { background: #f9fafb; color: #0f172a; }
        .dropdown-active { background: #f3f4f6; color: #0f172a; }

        .mobile-link{
          width:100%;
          text-align:left;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 700;
          color:#8B6F47;
          transition: background .2s ease, color .2s ease;
        }
        .mobile-link:hover{ background:#E5D5C0; color:#6B4423; }
        .mobile-active{ color:#6B4423; background:#E5D5C0; }

        .mobile-sub{
          width:100%;
          text-align:left;
          padding: 10px 12px;
          border-radius: 10px;
          font-weight: 600;
          color:#334155;
          background: rgba(255,255,255,0.6);
          transition: background .2s ease, color .2s ease;
        }
        .mobile-sub:hover{ background:#fff; color:#0f172a; }
        .mobile-sub-active{ background:#fff; color:#0f172a; }
      `}</style>
    </header>
  );
}

/* ===== helpers ===== */

function Dropdown({ open, align, children }) {
  return (
    <div
      className={[
        "absolute top-full mt-2 z-50",
        align === "right" ? "right-0" : "left-0",
        "w-56 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden",
        "transition-all duration-200 origin-top",
        open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
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

function IconHamburger() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
