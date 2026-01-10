import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BadgeCheck,
  MessageCircle,
  ClipboardCheck,
} from "lucide-react";

import KostCard from "@/components/public/KostCard";
import ContactKostModal from "@/components/public/ContactKostModal";
import BookingKostModal from "@/components/public/BookingKostModal";
import { Kosts } from "@/data/Kosts";

function formatRupiah(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

export default function KostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.key, id]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const kost = useMemo(
    () => Kosts.find((k) => String(k.id) === String(id)),
    [id]
  );

  const rekomendasiLain = useMemo(() => {
    return Kosts.filter((k) => k.id !== kost?.id).slice(0, 6);
  }, [kost]);

  const [openContact, setOpenContact] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);

  if (!kost) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-medium text-gray-900">
              Kost tidak ditemukan 😿
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className={[
          "mx-auto max-w-6xl px-4 py-8 space-y-12 transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ===== FOTO KOST ===== */}
          <div
            className="
              rounded-3xl
              border border-[#E6D5BC]
              bg-white
              shadow-[0_12px_30px_rgba(107,68,35,0.20)]
              overflow-hidden
            "
          >
            <div className="p-6">
              <div className="rounded-3xl overflow-hidden bg-white">
                <img
                  src={kost.image}
                  alt={kost.name}
                  draggable={false}
                  className="
                    w-full
                    h-[340px]        /* ✅ GAMBAR DIGEDEIN */
                    object-cover
                  "
                />
              </div>
            </div>
          </div>

          {/* ===== DETAIL ===== */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-gray-200 p-6 bg-white">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
                {kost.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {kost.location}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs border bg-gray-50">
                  {kost.type}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <BadgeCheck className="w-4 h-4" />
                  Tersedia
                </span>
              </div>

              <p className="mt-4 text-lg font-medium text-gray-900">
                Rp {formatRupiah(kost.price)}
                <span className="text-sm text-gray-500"> / bulan</span>
              </p>

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-900">Fasilitas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {kost.facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full border bg-white"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-700">
                {kost.description || "Belum ada deskripsi kost."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setOpenBooking(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white"
              >
                <ClipboardCheck className="w-5 h-5" />
                Ajukan Sewa
              </button>

              <button
                onClick={() => setOpenContact(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya via WhatsApp
              </button>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Rekomendasi Lainnya
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rekomendasiLain.map((k) => (
              <KostCard key={k.id} kost={k} />
            ))}
          </div>
        </section>
      </div>

      <BookingKostModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        kost={kost}
        waNumber="6281200000000"
      />

      <ContactKostModal
        open={openContact}
        onClose={() => setOpenContact(false)}
        kost={kost}
        waNumber="6281200000000"
      />
    </main>
  );
}
