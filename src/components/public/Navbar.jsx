import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setOpen(false);

  const desktopLinkClass = (to) =>
    `text-sm hover:text-white ${pathname === to ? "text-white" : "text-white/70"}`;

  const mobileLinkClass = (to) =>
    `text-left text-sm hover:text-white ${
      pathname === to ? "text-white" : "text-white/80"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-white">PAW KOST</h1>

        {/* Desktop menu (tanpa Dashboard) */}
        <nav className="hidden gap-6 md:flex">
          <Link to="/" className={desktopLinkClass("/")}>
            Katalog
          </Link>

          {/* kalau section kontak ada di Home, ini oke */}
          <a href="/#kontak" className="text-sm text-white/70 hover:text-white">
            Kontak
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("Login diklik")}
            className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 md:inline-flex"
          >
            Masuk
          </button>

          {/* Hamburger (mobile) */}
          <button
  onClick={() => setOpen((v) => !v)}
  className="rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white"
  aria-label="Toggle menu"
  aria-expanded={open}
>
  ☰
</button>

        </div>
      </div>

      {/* Mobile dropdown (Dashboard muncul di sini saja) */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
            <Link to="/" onClick={close} className={mobileLinkClass("/")}>
              Katalog
            </Link>

            <a
              href="/#kontak"
              onClick={close}
              className="text-left text-sm text-white/80 hover:text-white"
            >
              Kontak
            </a>

            {/* ✅ hanya muncul saat hamburger dibuka */}
            <Link to="/admin" onClick={close} className={mobileLinkClass("/admin")}>
              Dashboard
            </Link>

            <button
              onClick={() => {
                console.log("Login diklik");
                setOpen(false);
              }}
              className="mt-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Masuk
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
