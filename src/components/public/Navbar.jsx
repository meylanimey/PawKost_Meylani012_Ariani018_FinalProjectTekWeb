export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-white">PAW KOST</h1>

        <nav className="hidden gap-6 md:flex">
          <a href="#katalog" className="text-sm text-white/70 hover:text-white">
            Katalog
          </a>
          <a href="#kontak" className="text-sm text-white/70 hover:text-white">
            Kontak
          </a>
        </nav>

        <button
          onClick={() => console.log("Login diklik")}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Masuk
        </button>
      </div>
    </header>
  );
}
