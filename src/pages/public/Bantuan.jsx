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
        <section
          className="
            space-y-3
            rounded-2xl
            border border-[#E6D5BC]
            bg-[#FFF8ED]
            p-6
            shadow-sm
          "
        >
          <h1 className="text-2xl md:text-3xl font-medium text-[#6B4423]">
            Pusat Bantuan PAWKOST
          </h1>


          <p className="text-[#8B6F47] leading-relaxed">
            Selamat datang di Pusat Bantuan PAWKOST. Halaman ini disediakan untuk
            membantu kamu mendapatkan informasi dan solusi terkait penggunaan
            layanan PAWKOST.
          </p>


          <p className="text-[#8B6F47] leading-relaxed">
            Jika kamu ingin mencari kost, mendaftarkan kost, mengajukan kerja
            sama, atau menyampaikan saran dan masukan, silakan hubungi kami
            melalui formulir kontak yang tersedia. Tim PAWKOST akan berusaha
            merespons setiap pesan secepat mungkin.
          </p>
        </section>




        <section className="space-y-6">
          <h2 className="text-xl font-medium text-[#6B4423] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#6B4423]" />
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


        <section className="space-y-3">
          <h2 className="text-xl font-medium text-[#6B4423] flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-[#6B4423]" />
            Bantuan Akun
          </h2>
          <p className="text-[#8B6F47] leading-relaxed">
            Jika mengalami kendala pada akun, seperti lupa kata sandi atau masalah
            login, silakan hubungi tim PAWKOST melalui halaman kontak.
          </p>
        </section>


        <section className="rounded-2xl border border-[#E6D5BC] p-6 bg-white shadow-sm">
          <h3 className="text-lg font-medium text-[#6B4423]">
            Butuh Bantuan?
          </h3>
          <p className="mt-2 text-[#8B6F47]">
            Jika pertanyaan kamu belum terjawab, silakan hubungi kami melalui
            fitur Kontak agar tim PAWKOST dapat membantu kamu secara langsung.
          </p>
          <Link
            to="/kontak"
            className="
              inline-flex items-center gap-2
              mt-4 rounded-xl px-5 py-2.5
              bg-[#FFF4E3] text-[#6B4423]
              font-medium
              border border-[#E6D5BC]
              hover:bg-[#F3E6D4] transition
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
    <div className="rounded-xl border border-[#E6D5BC] p-4 bg-white hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-[#9C7A4F] mt-0.5" />
        <div>
          <p className="font-medium text-[#6B4423]">{question}</p>
          <p className="mt-1 text-sm text-[#8B6F47] leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}