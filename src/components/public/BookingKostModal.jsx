import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Copy,
  CalendarDays,
  Phone,
  User,
  MessageCircle,
} from "lucide-react";

function formatRupiah(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

function toISODate(d) {
  const date = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export default function BookingKostModal({
  open,
  onClose,
  kost,
  waNumber = "",
}) {
  const panelRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState(() => toISODate(new Date()));
  const [duration, setDuration] = useState("3"); // bulan
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setMounted(true);
      // lock scroll
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  // Close: ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onBackdrop = (e) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target)) onClose?.();
  };

  const templateMessage = useMemo(() => {
    if (!kost) return "";

    const lines = [
      `Halo, saya ingin ajukan sewa kost`,
      ``,
      `Kost: ${kost.name}`,
      `Lokasi: ${kost.location}`,
      `Harga: Rp ${formatRupiah(kost.price)} / 3 bulan`,
      ``,
      `Nama: ${name || "(isi nama)"}`,
      `No. WA: ${phone || "(isi no WA)"}`,
      `Tanggal Masuk: ${checkIn || "(pilih tanggal)"}`,
      `Durasi: ${duration || "(isi)"} bulan`,
      ``,
      `Catatan:`,
      `${note || "(opsional)"} `,
      ``,
      `Terima kasih`,
    ];

    return lines.join("\n");
  }, [kost, name, phone, checkIn, duration, note]);

  const waLink = useMemo(() => {
    if (!waNumber) return "#";
    const txt = encodeURIComponent(templateMessage);
    return `https://wa.me/${waNumber}?text=${txt}`;
  }, [waNumber, templateMessage]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateMessage);
      alert("Pesan berhasil disalin ✅");
    } catch {
      alert("Gagal menyalin pesan.");
    }
  };

  if (!open || !kost) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/40
        flex items-center justify-center
        p-4
      "
      onMouseDown={onBackdrop}
    >
      <div
        ref={panelRef}
        className={[
          "w-full max-w-2xl",
          "rounded-2xl bg-white border border-gray-200 shadow-xl",
          "transition-all duration-300",
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Ajukan Sewa</h3>
            <p className="mt-1 text-sm text-gray-600">
              Isi data pemesanan, lalu kirim ke WhatsApp pemilik.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg p-2
              hover:bg-gray-100 transition
              active:scale-[0.98]
            "
            aria-label="Tutup"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-900">{kost.name}</p>
              <p className="text-sm text-gray-600 mt-1">{kost.location}</p>
              <p className="text-sm text-gray-900 mt-2">
                Rp {formatRupiah(kost.price)}{" "}
                <span className="text-gray-500">/ 3 bulan</span>
              </p>
            </div>

            <Field label="Nama" icon={User}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Owen"
                className="
                  w-full rounded-xl border border-gray-200 bg-white
                  px-4 py-2.5 outline-none
                  text-gray-900 placeholder:text-gray-400
                  focus:ring-2 focus:ring-gray-200
                  transition
                "
              />
            </Field>

            <Field label="No. WhatsApp Kamu" icon={Phone}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 0812xxxxxxx"
                className="
                  w-full rounded-xl border border-gray-200 bg-white
                  px-4 py-2.5 outline-none
                  text-gray-900 placeholder:text-gray-400
                  focus:ring-2 focus:ring-gray-200
                  transition
                "
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal Masuk" icon={CalendarDays}>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="
                    w-full rounded-xl border border-gray-200 bg-white
                    px-4 py-2.5 outline-none
                    text-gray-900
                    focus:ring-2 focus:ring-gray-200
                    transition
                  "
                />
              </Field>

              <Field label="Durasi (bulan)">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="
                    w-full rounded-xl border border-gray-200 bg-white
                    px-4 py-2.5 outline-none
                    text-gray-900
                    focus:ring-2 focus:ring-gray-200
                    transition
                  "
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="6">6</option>
                  <option value="12">12</option>
                </select>
              </Field>
            </div>

            <Field label="Catatan (opsional)">
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Saya mau survey dulu / minta info ukuran kamar"
                className="
                  w-full rounded-xl border border-gray-200 bg-white
                  px-4 py-3 outline-none resize-none
                  text-gray-900 placeholder:text-gray-400
                  focus:ring-2 focus:ring-gray-200
                  transition
                "
              />
            </Field>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-900">
                  Preview Pesan
                </p>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="
                    inline-flex items-center gap-2
                    px-3 py-2 rounded-lg
                    border border-gray-200 bg-white
                    text-sm font-medium text-gray-900
                    hover:bg-gray-50 transition
                    active:scale-[0.98]
                  "
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>

              <pre className="mt-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {templateMessage}
              </pre>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="
                w-full inline-flex items-center justify-center gap-2
                px-5 py-3 rounded-xl
                font-medium text-white
                bg-[#25D366]
                hover:brightness-95 transition
                active:scale-[0.99]
              "
            >
              <MessageCircle className="w-5 h-5" />
              Ajukan Sewa
            </a>

            <button
              type="button"
              onClick={onClose}
              className="
                w-full inline-flex items-center justify-center
                px-5 py-3 rounded-xl
                font-medium
                border border-gray-200 bg-white text-gray-900
                hover:bg-gray-50 transition
                active:scale-[0.99]
              "
            >
              Tutup
            </button>

            <p className="text-xs text-gray-500">
              * Tombol WhatsApp akan membuka chat dengan pesan yang sudah
              otomatis terisi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-900 inline-flex items-center gap-2">
        {Icon ? <Icon className="w-4 h-4 text-gray-600" /> : null}
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}