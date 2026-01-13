import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileText,
  RefreshCcw,
  Database,
  Eye,
  LockKeyhole,
} from "lucide-react";

export default function Privasi() {
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
            Kebijakan Privasi PAWKOST
          </h1>
          <p className="text-[#8B6F47] leading-relaxed">
            PAWKOST menghargai dan melindungi privasi setiap pengguna. Kebijakan
            privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
            dan menjaga keamanan informasi pengguna saat menggunakan layanan
            PAWKOST.
          </p>
        </section>

        <section className="space-y-6">
          <PolicyItem
            icon={Database}
            title="1. Informasi yang Dikumpulkan"
            content="PAWKOST dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, serta data lain yang dibutuhkan untuk keperluan layanan."
          />

          <PolicyItem
            icon={Eye}
            title="2. Penggunaan Informasi"
            content="Informasi yang dikumpulkan digunakan untuk memberikan layanan, meningkatkan kualitas platform, serta mempermudah proses komunikasi antara pengguna dan pemilik kost."
          />

          <PolicyItem
            icon={LockKeyhole}
            title="3. Keamanan Data"
            content="PAWKOST berupaya menjaga keamanan data pengguna dan tidak akan membagikan informasi pribadi kepada pihak lain tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum."
          />

          <PolicyItem
            icon={RefreshCcw}
            title="4. Perubahan Kebijakan"
            content="PAWKOST dapat memperbarui kebijakan privasi sewaktu-waktu. Setiap perubahan akan diinformasikan melalui platform PAWKOST dan berlaku sejak ditetapkan."
          />
        </section>

        <section className="rounded-2xl border border-[#E6D5BC] bg-white p-6">
          <p className="text-sm text-[#8B6F47] leading-relaxed">
            Dengan menggunakan layanan PAWKOST, kamu dianggap telah membaca,
            memahami, dan menyetujui seluruh isi Kebijakan Privasi ini.
          </p>
        </section>
      </div>
    </main>
  );
}

function PolicyItem({ icon: Icon, title, content }) {
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

        <div className="space-y-1">
          <h3 className="font-medium text-[#6B4423] leading-snug">{title}</h3>
          <p className="text-sm text-[#8B6F47] leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}