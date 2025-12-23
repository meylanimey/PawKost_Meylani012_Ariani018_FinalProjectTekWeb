// src/components/public/Navbar.jsx
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <span className="text-sm font-bold text-white">PK</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">PAW KOST</p>
            <p className="text-xs text-white/60">Cari kost jadi gampang</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm text-white/70 hover:text-white" href="#katalog">
            Katalog
          </a>
          <a className="text-sm text-white/70 hover:text-white" href="#kontak">
            Kontak
          </a>
        </nav>

        <button
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90 active:scale-[0.99]"
          onClick={() => console.log("Masuk diklik")}
        >
          Masuk
        </button>
      </div>
    </header>
  );
}
