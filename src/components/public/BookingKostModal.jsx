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

export default function BookingKostModal({ open, onClose, kost, waNumber }) {
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState(() => toISODate(new Date()));
  const [duration, setDuration] = useState("3");
  const [note, setNote] = useState("");

  const data = useMemo(() => {
    if (!kost) return null;

    const nama = kost.nama ?? kost.name ?? "Nama Kost";
    const lokasi = kost.lokasi ?? kost.location ?? "-";

    const hargaRaw = kost.harga ?? kost.price ?? 0;
    const harga =
      typeof hargaRaw === "number"
        ? hargaRaw
        : Number(String(hargaRaw).replace(/[^\d]/g, "")) || 0;

    const ownerWA = kost.nomorPemilik ?? waNumber ?? "";

    return { nama, lokasi, harga, ownerWA };
  }, [kost, waNumber]);

  useEffect(() => {
    if (!open) return;
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onBackdrop = (e) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target)) onClose?.();
  };

  const templateMessage = useMemo(() => {
    if (!data) return "";

    return [
      `Halo, saya ingin mengajukan sewa kost`,
      ``,
      `Kost: ${data.nama}`,
      `Lokasi: ${data.lokasi}`,
      `Harga: Rp ${formatRupiah(data.harga)} / bulan`,
      ``,
      `Nama: ${name || "(isi nama)"}`,
      `No. WA: ${phone || "(isi no WA)"}`,
      `Tanggal Masuk: ${checkIn || "(pilih tanggal)"}`,
      `Durasi: ${duration || "(isi)"} bulan`,
      ``,
      `Catatan:`,
      `${note || "(opsional)"}`,
      ``,
      `Terima kasih`,
    ].join("\n");
  }, [data, name, phone, checkIn, duration, note]);

  const waLink = useMemo(() => {
    if (!data?.ownerWA) return "#";
    return `https://wa.me/${data.ownerWA}?text=${encodeURIComponent(
      templateMessage
    )}`;
  }, [data, templateMessage]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateMessage);
      alert("Pesan berhasil disalin ✅");
    } catch {
      alert("Gagal menyalin pesan.");
    }
  };

  if (!open || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4"
      onMouseDown={onBackdrop}
    >
      <div
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={[
          "w-full max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto",
          "rounded-2xl bg-white border border-gray-200 shadow-xl",
          "transition-all duration-300",
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium">Ajukan Sewa</h3>
            <p className="text-sm text-gray-600">
              Kirim permintaan ke WhatsApp pemilik kost
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X />
          </button>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <p className="font-medium">{data.nama}</p>
              <p className="text-sm text-gray-600">{data.lokasi}</p>
              <p className="mt-2">
                Rp {formatRupiah(data.harga)}{" "}
                <span className="text-gray-500">/ bulan</span>
              </p>
            </div>

            <Field label="Nama" icon={User}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </Field>

            <Field label="No. WhatsApp Kamu" icon={Phone}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal Masuk" icon={CalendarDays}>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Durasi (bulan)">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input"
                >
                  {[1, 2, 3, 6, 12].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Catatan (opsional)">
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input resize-none"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">Preview Pesan</p>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 border rounded-lg bg-white text-sm"
                >
                  <Copy className="w-4 h-4 inline mr-1" /> Copy
                </button>
              </div>

              <pre className="mt-3 text-sm whitespace-pre-wrap">
                {templateMessage}
              </pre>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-medium"
            >
              <MessageCircle /> Ajukan Sewa
            </a>

            <button
              onClick={onClose}
              className="w-full px-5 py-3 rounded-xl border bg-white"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium inline-flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}