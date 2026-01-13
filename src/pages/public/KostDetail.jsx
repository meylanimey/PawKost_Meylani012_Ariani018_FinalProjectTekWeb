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

import { KOSTS_ENDPOINT } from "@/api/mockapi";

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

  const [kost, setKost] = useState(null);
  const [allKosts, setAllKosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [openContact, setOpenContact] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const resDetail = await fetch(`${KOSTS_ENDPOINT}/${id}`);
        if (!resDetail.ok) {
          const text = await resDetail.text().catch(() => "");
          throw new Error(
            `Kost tidak ditemukan. (${resDetail.status}) ${text}`
          );
        }
        const detail = await resDetail.json();

        const resList = await fetch(KOSTS_ENDPOINT);
        if (!resList.ok) {
          const text = await resList.text().catch(() => "");
          throw new Error(`Gagal ambil list kost. (${resList.status}) ${text}`);
        }
        const list = await resList.json();

        if (!alive) return;

        setKost(detail);
        setAllKosts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Terjadi kesalahan");
        setKost(null);
        setAllKosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  const norm = useMemo(() => {
    if (!kost) return null;

    const name = kost.nama ?? kost.name ?? "Nama Kost";
    const image =
      kost.urlGambar ??
      kost.gambar ??
      kost.image ??
      "https://picsum.photos/seed/kostdetail/900/600";

    const locationText = kost.lokasi ?? kost.location ?? kost.daerah ?? "-";
    const type = kost.jenis ?? kost.type ?? "-";

    const priceRaw = kost.harga ?? kost.price ?? 0;
    const price =
      typeof priceRaw === "number"
        ? priceRaw
        : Number(String(priceRaw).replace(/[^\d]/g, "")) || 0;

    const facilitiesRaw = kost.fasilitas ?? kost.facilities ?? [];
    const facilities = Array.isArray(facilitiesRaw)
      ? facilitiesRaw
      : String(facilitiesRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const description = kost.deskripsi ?? kost.description ?? "";

    const status = String(kost.status ?? "Tersedia");
    const isAvailable = status.toLowerCase() !== "penuh";

    const waNumber = String(kost.nomorPemilik ?? "").replace(/\D/g, "");

    const isPublished = !!(kost.isPublished ?? true);

    return {
      ...kost,
      name,
      image,
      location: locationText,
      type,
      price,
      facilities,
      description,
      status,
      isAvailable,
      waNumber,
      isPublished,
    };
  }, [kost]);

  const rekomendasiLain = useMemo(() => {
    if (!norm) return [];

    return (allKosts || [])
      .filter((k) => String(k.id) !== String(norm.id))
      .filter((k) => !!(k?.isPublished ?? true))
      .slice(0, 6);
  }, [allKosts, norm]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-medium text-gray-900">
              Memuat detail kost...
            </h1>
            <p className="mt-2 text-sm text-gray-600">Tunggu sebentar ya.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!norm || err || !norm.isPublished) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-medium text-gray-900">
              Kost tidak ditemukan 😿
            </h1>

            {!!err && (
              <p className="mt-2 text-sm text-red-600 whitespace-pre-line">
                {err}
              </p>
            )}

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
                  src={norm.image}
                  alt={norm.name}
                  draggable={false}
                  className="w-full h-[340px] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-gray-200 p-6 bg-white">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
                {norm.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {norm.location}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs border bg-gray-50">
                  {norm.type}
                </span>

                <span
                  className={[
                    "inline-flex items-center gap-1 text-xs",
                    norm.isAvailable ? "text-green-600" : "text-red-600",
                  ].join(" ")}
                >
                  <BadgeCheck className="w-4 h-4" />
                  {norm.isAvailable ? "Tersedia" : "Penuh"}
                </span>
              </div>

              <p className="mt-4 text-lg font-medium text-gray-900">
                Rp {formatRupiah(norm.price)}
                <span className="text-sm text-gray-500"> / bulan</span>
              </p>

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-900">Fasilitas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(norm.facilities || []).map((f, i) => (
                    <span
                      key={`${f}-${i}`}
                      className="px-3 py-1 text-xs rounded-full border bg-white"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-700">
                {norm.description || "Belum ada deskripsi kost."}
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
                disabled={!norm.waNumber}
                title={!norm.waNumber ? "Nomor pemilik belum diisi" : ""}
                style={
                  !norm.waNumber
                    ? { opacity: 0.7, cursor: "not-allowed" }
                    : undefined
                }
              >
                <MessageCircle className="w-5 h-5" />
                Tanya via WhatsApp
              </button>
            </div>

            {!norm.waNumber && (
              <p className="text-xs text-red-600">
                Nomor pemilik belum tersedia. Minta admin isi field{" "}
                <b>nomorPemilik</b>.
              </p>
            )}
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
        kost={norm}
        waNumber={norm.waNumber}
      />

      <ContactKostModal
        open={openContact}
        onClose={() => setOpenContact(false)}
        kost={norm}
        waNumber={norm.waNumber}
      />
    </main>
  );
}