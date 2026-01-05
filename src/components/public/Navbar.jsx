import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
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
          <button
            onClick={() => console.log("Masuk diklik")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Masuk
          </button>

          {/* Hamburger */}
          <button
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-900 hover:bg-slate-50"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
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
      </div>

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
    </header>
  );
}
