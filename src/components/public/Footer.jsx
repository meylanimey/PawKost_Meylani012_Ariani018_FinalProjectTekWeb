import { Link } from "react-router-dom";
import {
  Instagram,
  Mail,
  Phone,
  HelpCircle,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function Footer() {
  return (
<<<<<<< Updated upstream
    <footer id="kontak" className="mt-20 border-t border-pink-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-lg font-bold text-slate-900">PAW KOST</h2>
          <p className="mt-2 text-sm text-slate-600">
            Platform pencarian kost yang memudahkan kamu menemukan tempat tinggal
            nyaman dan terjangkau di Yogyakarta.
          </p>
        </div>
=======
    <footer className="bg-[#C4AB97] text-white">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo-pawkost.png"
                alt="PAWKOST"
                className="w-14 h-14 object-contain"
              />
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#6F4417]">PAW</span>
                <span className="text-3xl font-normal text-[#8F6753]">
                  KOST
                </span>
              </div>
            </div>
>>>>>>> Stashed changes

            <p className="mt-4 text-sm leading-relaxed text-white/90">
              PAWKOST membantu kamu menemukan kost sesuai kebutuhan, mulai dari
              lokasi, fasilitas, hingga harga, melalui tampilan yang simpel dan
              mudah digunakan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Layanan</h4>
            <ul className="space-y-3 text-sm text-white">
              <li>
                <Link
                  to="/bantuan"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition"
                >
                  <HelpCircle className="w-4 h-4" />
                  Pusat Bantuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Kebijakan</h4>
            <ul className="space-y-3 text-sm text-white">
              <li>
                <Link
                  to="/privasi"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/syarat"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition"
                >
                  <FileText className="w-4 h-4" />
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                <a
                  href="https://www.instagram.com/pawkost"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-gray-200 transition"
                >
                  @pawkost
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a
                  href="mailto:pawwwkost@gmail.com"
                  className="text-white hover:text-gray-200 transition"
                >
                  pawwwkost@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                <a
                  href="https://wa.me/6289501331826"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-gray-200 transition"
                >
                  0895-0133-1826
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#EFE4D0] py-4 text-center text-sm text-[#6B4423]">
        © 2026 PAWKOST. All rights reserved.
      </div>
    </footer>
  );
}