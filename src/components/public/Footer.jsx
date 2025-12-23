export default function Footer() {
  return (
    <footer id="kontak" className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-lg font-bold text-slate-900">PAW KOST</h2>
          <p className="mt-2 text-sm text-slate-600">
            Platform pencarian kost yang memudahkan kamu menemukan tempat tinggal
            nyaman dan terjangkau di Yogyakarta.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="mb-3 font-semibold text-slate-900">Menu</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a className="hover:text-slate-900" href="/">
                Beranda
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900" href="#katalog">
                Daftar Kost
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900" href="#kontak">
                Kontak
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 font-semibold text-slate-900">Kontak</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>📍 Yogyakarta, Indonesia</li>
            <li>📞 081233456789</li>
            <li>✉️ pawkost@email.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PAW KOST. All rights reserved.
      </div>
    </footer>
  );
}
