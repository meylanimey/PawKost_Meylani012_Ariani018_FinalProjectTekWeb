import { useEffect, useState } from "react";
import { ShieldCheck, FileText, RefreshCcw } from "lucide-react";

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
        <section className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
            Kebijakan Privasi PAWKOST
          </h1>
          <p className="text-gray-600 leading-relaxed">
            PAWKOST menghargai dan melindungi privasi setiap pengguna. Kebijakan
            privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
            dan menjaga keamanan informasi pengguna saat menggunakan layanan
            PAWKOST.
          </p>
        </section>

        <section className="space-y-6">
          <PolicyItem
            icon={FileText}
            title="1. Informasi yang Dikumpulkan"
            content="PAWKOST dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, serta data lain yang dibutuhkan untuk keperluan layanan."
          />

          <PolicyItem
            icon={ShieldCheck}
            title="2. Penggunaan Informasi"
            content="Informasi yang dikumpulkan digunakan untuk memberikan layanan, meningkatkan kualitas platform, serta mempermudah proses komunikasi antara pengguna dan pemilik kost."
          />

          <PolicyItem
            icon={ShieldCheck}
            title="3. Keamanan Data"
            content="PAWKOST berupaya menjaga keamanan data pengguna dan tidak akan membagikan informasi pribadi kepada pihak lain tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum."
          />

          <PolicyItem
            icon={RefreshCcw}
            title="4. Perubahan Kebijakan"
            content="PAWKOST dapat memperbarui kebijakan privasi sewaktu-waktu. Setiap perubahan akan diinformasikan melalui platform PAWKOST dan berlaku sejak ditetapkan."
          />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
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