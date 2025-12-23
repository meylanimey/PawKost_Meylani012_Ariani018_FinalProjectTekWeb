// src/components/public/Footer.jsx
export default function Footer() {
  return (
    <footer id="kontak" className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-white">PAW KOST</p>
            <p className="mt-2 text-sm text-white/60">
              UI statis untuk Checkpoint 1 (katalog kost + tombol interaktif).
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Fitur (CP1)</p>
            <ul className="mt-2 space-y-2 text-sm text-white/60">
              <li>Dummy data di useState</li>
              <li>Komponen atomic</li>
              <li>Event handling (console.log)</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Kontak</p>
            <p className="mt-2 text-sm text-white/60">
              IG: @paw-kost <br />
              Email: pawkost@example.com
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} PAW KOST — Final Project Tekweb
        </div>
      </div>
    </footer>
  );
}
