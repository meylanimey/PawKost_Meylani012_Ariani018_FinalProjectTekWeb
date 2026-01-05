import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle } from "lucide-react";

const DEFAULT_TEMPLATES = [
  {
    id: "booking",
    label: "Saya butuh cepat nih. Bisa booking sekarang?",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini dan ingin booking sekarang.\n\nNama kost: ${
        kost.name
      }\nLokasi: ${kost.location}\nTipe: ${kost.type}\nHarga: Rp ${Number(
        kost.price || 0
      ).toLocaleString("id-ID")} / 3 bulan\n\nApakah masih tersedia?`,
  },
  {
    id: "alamat",
    label: "Alamat kost di mana?",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh minta alamat lengkap dan patokannya?`,
  },
  {
    id: "survei",
    label: "Saya ingin survei dulu",
    sub: "Apakah bisa survei hari ini / besok?",
    build: (kost) =>
      `Halo, saya ingin survei kost ini dulu.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nApakah bisa survei hari ini atau besok?`,
  },
  {
    id: "kamar",
    label: "Masih ada kamar?",
    build: (kost) =>
      `Halo, apakah masih ada kamar tersedia?\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\nTipe: ${kost.type}\n\nKalau ada, boleh info tipe kamar & ketentuannya?`,
  },
  {
    id: "aturan",
    label: "Boleh tanya aturan & fasilitasnya?",
    build: (kost) =>
      `Halo, saya tertarik dengan kost ini.\n\nNama kost: ${kost.name}\nLokasi: ${kost.location}\n\nBoleh info aturan kost dan fasilitas detailnya?`,
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

  useEffect(() => {
    if (!open) return;
    setMounted(true);
    setSelectedId(templates?.[0]?.id || "booking");
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

  const selected = useMemo(
    () => templates.find((t) => t.id === selectedId) || templates[0],
    [templates, selectedId]
  );

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
      {/* BACKDROP */}
      <div
        className={[
          "absolute inset-0 bg-black/40",
          "transition-opacity duration-200",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          className={[
            "w-full max-w-2xl rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden",
            "transition-all duration-200",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3 p-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Hubungi Kost
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Pilih template pesan, lalu kirim via WhatsApp.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl p-2
                border border-gray-200 bg-white
                hover:bg-gray-50 transition
                active:scale-[0.98]
              "
              aria-label="Tutup"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* INFO BAR */}
          <div className="px-6 pt-5">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <p className="text-sm text-emerald-800">
                Kamu akan terhubung ke pemilik melalui WhatsApp.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 grid md:grid-cols-2 gap-5">
            {/* LEFT: choices */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Kirim Pesan ke Iklan
              </p>

              <div
                className="
                  rounded-2xl border border-gray-200 bg-white
                  max-h-[320px] overflow-auto
                "
              >
                {templates.map((t) => {
                  const active = t.id === selectedId;
                  return (
                    <label
                      key={t.id}
                      className={[
                        "flex items-start gap-3 p-4 cursor-pointer",
                        "border-b border-gray-100 last:border-b-0",
                        "transition",
                        active ? "bg-gray-50" : "hover:bg-gray-50/70",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="template"
                        checked={active}
                        onChange={() => setSelectedId(t.id)}
                        className="mt-1 accent-emerald-600"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {t.label}
                        </p>
                        {t.sub && (
                          <p className="text-xs text-gray-600 mt-1">{t.sub}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Preview Pesan</p>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <pre className="text-xs whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {messageText}
                </pre>
              </div>

              {/* CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-1 inline-flex w-full items-center justify-center gap-2
                  rounded-2xl px-5 py-3 font-medium
                  bg-[#25D366] text-white
                  hover:bg-emerald-700 transition
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
            </div>
          </div>

          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500">
              * Pesan otomatis bisa kamu edit nanti di WhatsApp sebelum dikirim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}