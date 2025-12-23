<<<<<<< HEAD
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
=======
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-bold text-slate-900">
            PAW KOST
          </Link>
          <span className="hidden text-sm text-slate-500 md:inline">
            Temukan kost impianmu
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#katalog" className="text-sm text-slate-600 hover:text-slate-900">
            Katalog
          </a>
          <a href="#kontak" className="text-sm text-slate-600 hover:text-slate-900">
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
            Kontak
          </a>
          <button
            onClick={() => console.log("Masuk diklik")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Masuk
          </button>
        </nav>

<<<<<<< HEAD
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
=======
        {/* Mobile Hamburger */}
        <button
          className="md:hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-900 hover:bg-slate-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {/* icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-3 space-y-2">
            <a
              href="#katalog"
              className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Katalog
            </a>
            <a
              href="#kontak"
              className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Kontak
            </a>
            <button
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
              onClick={() => {
                console.log("Masuk diklik");
                setOpen(false);
              }}
>>>>>>> a9a8d69854707f7f5ed2e27fef6a17ee409d2c4a
            >
              Masuk
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
