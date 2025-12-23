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
            Kontak
          </a>
          <button
            onClick={() => console.log("Masuk diklik")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Masuk
          </button>
        </nav>

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
            >
              Masuk
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
