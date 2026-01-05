import { useEffect, useState } from "react";
import {
  FileText,
  UserCheck,
  Home,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

export default function Syarat() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div
        className={[
          "mx-auto max-w-4xl px-4 py-10 space-y-10",
          "transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* HEADER */}
        <section className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
            Syarat dan Ketentuan PAWKOST
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Dengan mengakses dan menggunakan PAWKOST, pengguna dianggap telah
            membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang
            berlaku.
          </p>
        </section>

        {/* CONTENT */}
        <section className="space-y-6">
          <TermItem
            icon={FileText}
            title="1. Ketentuan Umum"
            content="PAWKOST merupakan platform yang menyediakan informasi kost untuk membantu pengguna dalam mencari tempat tinggal. Seluruh layanan yang tersedia dapat digunakan sesuai dengan ketentuan yang berlaku."
          />

          <TermItem
            icon={UserCheck}
            title="2. Akun dan Data Pengguna"
            content="Pengguna bertanggung jawab atas kebenaran data yang diberikan pada saat menggunakan layanan PAWKOST. PAWKOST berhak menolak, menangguhkan, atau menghapus akun yang terbukti memberikan informasi tidak sesuai."
          />

          <TermItem
            icon={Home}
            title="3. Informasi Kost"
            content="Informasi kost yang ditampilkan di PAWKOST berasal dari pemilik kost dan telah melalui proses peninjauan oleh admin. Pengguna disarankan untuk menghubungi pemilik kost secara langsung untuk memastikan ketersediaan kamar, harga, dan fasilitas sebelum melakukan pemesanan."
          />

          <TermItem
            icon={ShieldCheck}
            title="4. Hak dan Kewajiban"
            content="Pengguna wajib menggunakan layanan PAWKOST secara bijak dan tidak menyalahgunakan fitur yang tersedia. PAWKOST berhak melakukan pembaruan sistem demi meningkatkan kualitas layanan."
          />

          <TermItem
            icon={RefreshCcw}
            title="5. Perubahan Ketentuan"
            content="PAWKOST dapat mengubah syarat dan ketentuan sewaktu-waktu. Setiap perubahan akan diinformasikan melalui platform PAWKOST dan berlaku sejak tanggal ditetapkan."
          />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Jika kamu memiliki pertanyaan terkait Syarat & Ketentuan ini, kamu
            bisa menghubungi tim PAWKOST melalui halaman Kontak.
          </p>
        </section>
      </div>
    </main>
  );
}

function TermItem({ icon: Icon, title, content }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}