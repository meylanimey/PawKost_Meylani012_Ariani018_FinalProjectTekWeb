import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, ChevronRight } from "lucide-react";

function formatRupiah(num) {
  const n = Number(String(num ?? 0).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString("id-ID");
}

function normalizePhone(raw) {
  let s = String(raw ?? "").replace(/\D/g, "");
  if (s.startsWith("0")) s = `62${s.slice(1)}`;
  return s;
}

function getNama(k) {
  return k?.nama ?? k?.name ?? k?.namaKost ?? "Nama kost";
}
function getLokasi(k) {
  return k?.lokasi ?? k?.location ?? k?.alamat ?? "-";
}
function getDaerah(k) {
  return k?.daerah ?? "-";
}
function getTipe(k) {
  return k?.jenis ?? k?.type ?? "-";
}
function getHarga(k) {
  return k?.harga ?? k?.price ?? 0;
}

const DEFAULT_TEMPLATES = [
  {
    id: "booking",
    label: "Saya butuh cepat. Bisa booking sekarang?",
    tag: "Booking",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini dan ingin booking sekarang.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        `Tipe: ${getTipe(kost)}`,
        `Harga: Rp ${formatRupiah(getHarga(kost))} / bulan`,
        "",
        "Apakah masih tersedia?",
      ].join("\n"),
  },
  {
    id: "alamat",
    label: "Boleh minta alamat lengkap & patokannya?",
    tag: "Lokasi",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Boleh minta alamat lengkap dan patokannya?",
      ].join("\n"),
  },
  {
    id: "survei",
    label: "Saya ingin survei dulu. Bisa hari ini / besok?",
    tag: "Survey",
    build: (kost) =>
      [
        "Halo, saya ingin survei kost ini dulu.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Apakah bisa survei hari ini atau besok?",
      ].join("\n"),
  },
  {
    id: "kamar",
    label: "Masih ada kamar kosong? Tipe apa saja?",
    tag: "Ketersediaan",
    build: (kost) =>
      [
        "Halo, apakah masih ada kamar tersedia?",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        `Tipe: ${getTipe(kost)}`,
        "",
        "Kalau ada, boleh info tipe kamar & ketentuannya?",
      ].join("\n"),
  },
  {
    id: "aturan",
    label: "Boleh tanya aturan & fasilitas detailnya?",
    tag: "Aturan",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Boleh info aturan kost dan fasilitas detailnya?",
      ].join("\n"),
  },
  {
    id: "harga-net",
    label: "Harga net berapa? Ada biaya tambahan?",
    tag: "Harga",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        `Harga Rp ${formatRupiah(
          getHarga(kost)
        )}/bulan itu sudah termasuk apa saja? (listrik/air/WiFi/parkir)`,
        "Ada biaya tambahan/deposit?",
      ].join("\n"),
  },
  {
    id: "deposit",
    label: "Deposit berapa? Refundable?",
    tag: "Pembayaran",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Boleh info deposit/uang jaminan berapa, dan apakah refundable saat check-out?",
      ].join("\n"),
  },
  {
    id: "minimum",
    label: "Minimal sewa berapa bulan?",
    tag: "Sewa",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Minimal sewa berapa bulan? Bisa sewa bulanan atau harus 3/6/12 bulan?",
      ].join("\n"),
  },
  {
    id: "listrik",
    label: "Listrik token/prabayar atau include?",
    tag: "Fasilitas",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Untuk listrik sistemnya bagaimana? Include atau token/prabayar? Daya listrik per kamar berapa?",
      ].join("\n"),
  },
  {
    id: "wifi",
    label: "WiFi tersedia? Kecepatan & jam aktifnya?",
    tag: "Fasilitas",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Apakah tersedia WiFi? Kira-kira kecepatannya berapa Mbps dan stabil tidak?",
      ].join("\n"),
  },
  {
    id: "parkir",
    label: "Parkir motor/mobil tersedia? Biayanya?",
    tag: "Parkir",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Parkir motor/mobil tersedia? Ada biaya tambahan atau include?",
      ].join("\n"),
  },
  {
    id: "jam-bertamu",
    label: "Jam bertamu & aturan tamu bagaimana?",
    tag: "Aturan",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Aturan tamu bagaimana? Jam bertamu sampai jam berapa? Boleh menginap atau tidak?",
      ].join("\n"),
  },
  {
    id: "pet",
    label: "Boleh bawa hewan peliharaan?",
    tag: "Aturan",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Apakah diperbolehkan membawa hewan peliharaan? Jika boleh, ada syarat tertentu?",
      ].join("\n"),
  },
  {
    id: "foto-video",
    label: "Boleh minta foto/video kamar yang tersedia?",
    tag: "Media",
    build: (kost) =>
      [
        "Halo, saya tertarik dengan kost ini.",
        "",
        `Nama kost: ${getNama(kost)}`,
        `Daerah: ${getDaerah(kost)}`,
        `Lokasi: ${getLokasi(kost)}`,
        "",
        "Boleh minta foto/video kamar yang sedang tersedia + kamar mandi dan area dapur/parkir?",
      ].join("\n"),
  },
];

export default function ContactKostModal({
  open,
  onClose,
  kost,
  waNumber = "",
  templates = DEFAULT_TEMPLATES,
}) {
  const [selectedId, setSelectedId] = useState(templates?.[0]?.id || "booking");
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    setMounted(true);
    setSelectedId(templates?.[0]?.id || "booking");
    setQ("");
  }, [open, templates]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const filteredTemplates = useMemo(() => {
    const s = (q || "").trim().toLowerCase();
    if (!s) return templates;
    return templates.filter((t) => {
      const a = `${t.label} ${t.tag || ""} ${t.sub || ""}`.toLowerCase();
      return a.includes(s);
    });
  }, [templates, q]);

  const selected = useMemo(() => {
    const hit = templates.find((t) => t.id === selectedId);
    return hit || templates[0];
  }, [templates, selectedId]);

  const messageText = useMemo(() => {
    if (!kost || !selected?.build) return "";
    return selected.build(kost);
  }, [kost, selected]);

  const finalWa = useMemo(() => {
    const fromProp = normalizePhone(waNumber);
    if (fromProp) return fromProp;
    const fromKost = normalizePhone(kost?.nomorPemilik);
    return fromKost || "";
  }, [waNumber, kost]);

  const waLink = useMemo(() => {
    if (!finalWa) return "#";
    const txt = encodeURIComponent(messageText || "");
    return `https://wa.me/${finalWa}?text=${txt}`;
  }, [finalWa, messageText]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <div
        className={[
          "absolute inset-0 bg-black/50",
          "transition-opacity duration-200",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          className={[
            "w-full max-w-xl md:max-w-3xl",
            "max-h-[85vh] overflow-y-auto",
            "rounded-[28px] bg-gradient-to-b from-emerald-50 to-white p-[1px]",
            "shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
            "transition-all duration-200",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="rounded-[27px] bg-white">
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  Tanya Pemilik Kost
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Pilih pertanyaan, lihat preview, lalu kirim ke WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-2xl p-2
                  border border-gray-200 bg-white
                  hover:bg-gray-50 transition
                  active:scale-[0.98]
                "
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="px-5 pt-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-sm text-emerald-800">
                  Kamu akan terhubung ke pemilik melalui WhatsApp.
                </p>
                {!finalWa ? (
                  <p className="text-xs text-amber-700 mt-1">
                    Nomor pemilik belum tersedia. Isi <b>nomorPemilik</b> di
                    data kost ya.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="p-5 grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Pilih Pertanyaan
                  </p>
                  <span className="text-xs text-gray-500">
                    {filteredTemplates.length} opsi
                  </span>
                </div>

                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari: harga, parkir, wifi, aturan..."
                    className="
                      w-full rounded-2xl border border-gray-200
                      bg-white px-4 py-2.5 pr-10
                      text-sm text-gray-900 placeholder:text-gray-400
                      outline-none focus:ring-2 focus:ring-emerald-100
                    "
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  <div className="max-h-[360px] overflow-auto p-2">
                    <div className="grid gap-2">
                      {filteredTemplates.map((t) => {
                        const active = t.id === selectedId;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedId(t.id)}
                            className={[
                              "w-full text-left rounded-2xl p-3.5",
                              "border transition",
                              active
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-gray-200 bg-white hover:bg-gray-50",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  {t.label}
                                </p>
                                {t.sub ? (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {t.sub}
                                  </p>
                                ) : null}
                              </div>

                              {t.tag ? (
                                <span
                                  className={[
                                    "shrink-0 text-[11px] px-2 py-1 rounded-full border",
                                    active
                                      ? "border-emerald-200 text-emerald-700 bg-white"
                                      : "border-gray-200 text-gray-600 bg-gray-50",
                                  ].join(" ")}
                                >
                                  {t.tag}
                                </span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filteredTemplates.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        Tidak ada hasil untuk pencarian:{" "}
                        <span className="font-medium text-gray-800">{q}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Preview Pesan
                  </p>
                  <span className="text-xs text-gray-500">
                    Siap kirim ke WA
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4">
                  <pre className="text-xs whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {messageText}
                  </pre>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "inline-flex w-full items-center justify-center gap-2",
                    "rounded-2xl px-5 py-3 font-semibold",
                    finalWa
                      ? "bg-[#25D366] text-white hover:brightness-95"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed",
                    "transition active:scale-[0.99]",
                  ].join(" ")}
                  onClick={(e) => {
                    if (!finalWa) e.preventDefault();
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Kirim via WhatsApp
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    w-full rounded-2xl px-5 py-3 font-medium
                    border border-gray-200 bg-white text-gray-900
                    hover:bg-gray-50 transition
                    active:scale-[0.99]
                  "
                >
                  Batal
                </button>

                <p className="text-xs text-gray-500">
                  * Pesan otomatis bisa kamu edit nanti di WhatsApp sebelum
                  dikirim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}