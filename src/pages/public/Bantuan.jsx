import { useEffect, useState } from "react";
import { HelpCircle, Search, PhoneCall, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Bantuan() {
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
            Pusat Bantuan PAWKOST
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Selamat datang di Pusat Bantuan PAWKOST. Halaman ini disediakan
            untuk membantu kamu mendapatkan informasi dan solusi terkait
            penggunaan layanan PAWKOST.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Jika kamu ingin mencari kost, mendaftarkan kost, mengajukan kerja
            sama, atau menyampaikan saran dan masukan, silakan hubungi kami
            melalui formulir kontak yang tersedia. Tim PAWKOST akan berusaha
            merespons setiap pesan secepat mungkin.
          </p>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Pertanyaan Umum
          </h2>

          <div className="space-y-4">
            <FaqItem
              icon={Search}
              question="Apa itu PAWKOST?"
              answer="PAWKOST adalah platform pencarian kost yang membantu kamu menemukan kost sesuai kebutuhan lokasi, fasilitas, dan harga."
            />

            <FaqItem
              icon={Search}
              question="Bagaimana cara mencari kost?"
              answer="Kamu bisa menggunakan fitur pencarian dan filter untuk menyesuaikan nama kost, jenis kost, lokasi, harga, serta fasilitas yang diinginkan."
            />

            <FaqItem
              icon={PhoneCall}
              question="Bagaimana cara menghubungi pemilik kost?"
              answer="Informasi kontak pemilik kost tersedia pada halaman detail kost yang kamu pilih."
            />
          </div>
        </section>

        {/* AKUN */}
        <section className="space-y-3">
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Bantuan Akun
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Jika mengalami kendala pada akun, seperti lupa kata sandi atau
            masalah login, silakan hubungi tim PAWKOST melalui halaman kontak.
          </p>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            Butuh Bantuan Lain?
          </h3>
          <p className="mt-2 text-gray-600">
            Jika pertanyaan kamu belum terjawab, silakan hubungi kami melalui
            fitur Kontak agar tim PAWKOST dapat membantu kamu secara langsung.
          </p>

          <Link
            to="/kontak"
            className="
              inline-flex items-center gap-2
              mt-4 rounded-xl px-5 py-2.5
              bg-gray-900 text-white
              font-medium
              hover:bg-gray-800 transition
              active:scale-[0.98]
            "
          >
            Hubungi PAWKOST
          </Link>
        </section>
      </div>
    </main>
  );
}

function FaqItem({ icon: Icon, question, answer }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{question}</p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}