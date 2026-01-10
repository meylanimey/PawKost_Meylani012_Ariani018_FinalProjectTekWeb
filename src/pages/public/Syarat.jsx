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
<section
  className="
    rounded-2xl
    border border-[#E6D5BC]
    bg-[#FFF7ED]
    p-6
    space-y-3
  "
>
  <h1 className="text-2xl md:text-3xl font-medium text-[#6B4423]">
    Syarat dan Ketentuan PAWKOST
  </h1>
  <p className="text-[#8B6F47] leading-relaxed">
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

        {/* FOOT NOTE */}
        <section className="rounded-2xl border border-[#E6D5BC] bg-white p-6">
          <p className="text-sm text-[#8B6F47] leading-relaxed">
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
    <div
      className="
        rounded-2xl
        border border-[#E6D5BC]
        bg-white
        p-5
        hover:shadow-[0_6px_18px_rgba(107,68,35,0.15)]
        transition
      "
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className="
            flex items-center justify-center
            w-10 h-10
            rounded-xl
            bg-[#FFF4E3]
            border border-[#E6D5BC]
            shrink-0
          "
        >
          <Icon className="w-6 h-6 text-[#6B4423]" />
        </div>

        {/* TEXT */}
        <div className="space-y-1">
          <h3 className="font-medium text-[#6B4423] leading-snug">
            {title}
          </h3>
          <p className="text-sm text-[#8B6F47] leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
