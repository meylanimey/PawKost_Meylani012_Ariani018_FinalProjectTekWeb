import { useEffect, useState } from "react";
import SocialCard from "@/components/public/SocialCard";
import ContactForm from "@/components/public/ContactForm";

import {
  Instagram as InstagramIcon,
  Mail as MailIcon,
  Phone as WhatsAppIcon,
  Music2 as TiktokIcon,
} from "lucide-react";

const SOCIALS = {
  instagram: {
    title: "Instagram",
    handle: "@pawkost",
    url: "https://instagram.com/pawkost",
    desc: "Update kost terbaru, tips cari kost, dan info promo.",
    Icon: InstagramIcon,
    color: "#E1306C",
    bg: "#FCE7F3",
  },
  whatsapp: {
    title: "WhatsApp",
    handle: "+62 812-0000-0000",
    number: "6281200000000",
    url: "https://wa.me/6281200000000",
    desc: "Respon cepat untuk tanya kost, kerja sama, atau bantuan.",
    Icon: WhatsAppIcon,
    color: "#25D366",
    bg: "#DCFCE7",
  },
  email: {
    title: "Email",
    handle: "pawwwkost@gmail.com",
    address: "pawwwkost@gmail.com",
    url: "mailto:pawwwkost@gmail.com",
    desc: "Untuk partnership, sponsorship, dan kebutuhan formal.",
    Icon: MailIcon,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  tiktok: {
    title: "TikTok",
    handle: "@pawkost",
    url: "https://www.tiktok.com/@pawkost",
    desc: "Konten seru seputar kost dan kehidupan anak kost.",
    Icon: TiktokIcon,
    color: "#000000",
    bg: "#F0F0F0",
  },
};

export default function Kontak() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const socialList = Object.values(SOCIALS);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div
          className={[
            // 👉 KOTAK ISINYA CREAM
            "relative rounded-3xl border border-gray-200 bg-[#FFF7ED]",
            "shadow-sm p-7 md:p-9",
            "transition-all duration-700 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <img
            src="/images/owen.png"
            alt="Maskot PAWKOST"
            className="
              absolute -top-10 right-6
              w-28 md:w-36
              drop-shadow-lg
              select-none pointer-events-none
            "
          />

          {/* BOLD → COKLAT TUA */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#5C4033]">
            Kontak PAWKOST
          </h1>

          {/* TEKS BIASA → COKLAT MUDA */}
          <p className="mt-2 max-w-2xl text-[#8B6F47]">
            Terhubung langsung dengan PAWKOST lewat sosial media resmi atau kirim
            pesan menggunakan form di halaman ini. Kami siap bantu kamu cari kost
            terbaik 🐾
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div
          className={[
            "grid lg:grid-cols-2 gap-8 mt-2",
            "transition-all duration-700 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <div className="space-y-4">
            <div>
              {/* BOLD → COKLAT TUA */}
              <h2 className="text-xl font-bold text-[#5C4033]">
                Sosial Media Resmi
              </h2>

              {/* TEKS BIASA → COKLAT MUDA */}
              <p className="text-sm text-[#8B6F47] mt-1">
                Follow atau hubungi kami lewat platform favorit kamu.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {socialList.map((s) => (
                <SocialCard
                  key={s.title}
                  title={s.title}
                  handle={s.handle}
                  desc={s.desc}
                  href={s.url}
                  Icon={s.Icon}
                  color={s.color}
                  bg={s.bg}
                />
              ))}
            </div>
          </div>

          <div>
            <ContactForm socials={SOCIALS} />
          </div>
        </div>
      </section>
    </main>
  );
}
