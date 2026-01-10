import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, Sparkles, ChevronRight } from "lucide-react";


const DEFAULT_TEMPLATES = [
  {
    id: "booking",
    label: "Saya butuh cepat. Bisa booking sekarang?",
    tag: "Booking",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini dan ingin booking sekarang.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\nTipe: ${kost.type}\nHarga: Rp ${Number(kost.price || 0).toLocaleString(
        "id-ID"
      )} / Bulan\n\nApakah masih tersedia?`,
  },
  {
    id: "alamat",
    label: "Boleh minta alamat lengkap & patokannya?",
    tag: "Lokasi",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh minta alamat lengkap dan patokannya?`,
  },
  {
    id: "survei",
    label: "Saya ingin survei dulu. Bisa hari ini / besok?",
    tag: "Survey",
    build: (kost) =>
      `Halo, saya ingin survei kost ini dulu.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nApakah bisa survei hari ini atau besok?`,
  },
  {
    id: "kamar",
    label: "Masih ada kamar kosong? Tipe apa saja?",
    tag: "Ketersediaan",
    build: (kost) =>
      `Halo, apakah masih ada kamar tersedia?\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\nTipe: ${kost.type}\n\nKalau ada, boleh info tipe kamar & ketentuannya?`,
  },
  {
    id: "aturan",
    label: "Boleh tanya aturan & fasilitas detailnya?",
    tag: "Aturan",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh info aturan kost dan fasilitas detailnya?`,
  },


  {
    id: "harga-net",
    label: "Harga net berapa? Ada biaya tambahan?",
    tag: "Harga",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nHarga Rp ${Number(kost.price || 0).toLocaleString(
        "id-ID"
      )}/bulan itu sudah termasuk apa saja? (listrik/air/WiFi/parkir)\nAda biaya tambahan/deposit?`,
  },
  {
    id: "deposit",
    label: "Deposit berapa? Refundable?",
    tag: "Pembayaran",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh info deposit/uang jaminan berapa, dan apakah refundable saat check-out?`,
  },
  {
    id: "minimum",
    label: "Minimal sewa berapa bulan?",
    tag: "Sewa",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nMinimal sewa berapa bulan? Bisa sewa bulanan atau harus 3/6/12 bulan?`,
  },
  {
    id: "listrik",
    label: "Listrik token/prabayar atau include?",
    tag: "Fasilitas",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nUntuk listrik sistemnya bagaimana? Include atau token/prabayar? Daya listrik per kamar berapa?`,
  },
  {
    id: "wifi",
    label: "WiFi tersedia? Kecepatan & jam aktifnya?",
    tag: "Fasilitas",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nApakah tersedia WiFi? Kira-kira kecepatannya berapa Mbps dan stabil tidak?`,
  },
  {
    id: "parkir",
    label: "Parkir motor/mobil tersedia? Biayanya?",
    tag: "Parkir",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nParkir motor/mobil tersedia? Ada biaya tambahan atau include?`,
  },
  {
    id: "jam-bertamu",
    label: "Jam bertamu & aturan tamu bagaimana?",
    tag: "Aturan",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nAturan tamu bagaimana? Jam bertamu sampai jam berapa? Boleh menginap atau tidak?`,
  },
  {
    id: "pet",
    label: "Boleh bawa hewan peliharaan?",
    tag: "Aturan",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nApakah diperbolehkan membawa hewan peliharaan? Jika boleh, ada syarat tertentu?`,
  },
  {
    id: "foto-video",
    label: "Boleh minta foto/video kamar yang tersedia?",
    tag: "Media",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh minta foto/video kamar yang sedang tersedia + kamar mandi dan area dapur/parkir?`,
  },
];


export default function ContactKostModal({
  open,
  onClose,
  kost,
  waNumber = "6281200000000",
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


  const waLink = useMemo(() => {
    const txt = encodeURIComponent(messageText || "");
    return `https://wa.me/${waNumber}?text=${txt}`;
  }, [waNumber, messageText]);


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
                <div className="inline-flex items-center gap-2">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    Tanya Pemilik Kost
                  </h3>
                </div>
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


            {/* Info bar */}
            <div className="px-5 pt-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-sm text-emerald-800">
                  Kamu akan terhubung ke pemilik melalui WhatsApp.
                </p>
              </div>
            </div>


            {/* Body layout baru: kiri list cards + search, kanan preview sticky */}
            <div className="p-5 grid md:grid-cols-2 gap-5">
              {/* LEFT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Pilih Pertanyaan
                  </p>
                  <span className="text-xs text-gray-500">
                    {filteredTemplates.length} opsi
                  </span>
                </div>


                {/* search */}
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


                {/* list style baru: card tiles */}
                <div
                  className="
                    rounded-2xl border border-gray-200 bg-white
                    overflow-hidden
                  "
                >
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


              {/* RIGHT */}
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
                  className="
                    inline-flex w-full items-center justify-center gap-2
                    rounded-2xl px-5 py-3 font-semibold
                    bg-[#25D366] text-white
                    hover:brightness-95 transition
                    active:scale-[0.99]
                  "
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