import { useMemo, useState } from "react";
import { Mail, MessageCircle, Instagram, Copy } from "lucide-react";

export default function ContactForm({ socials }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Kerja Sama");
  const [message, setMessage] = useState("");

  const waColor = socials?.whatsapp?.color || "#25D366";
  const waBg = socials?.whatsapp?.bg || "#DCFCE7";

  const igColor = socials?.instagram?.color || "#E1306C";
  const igBg = socials?.instagram?.bg || "#FCE7F3";

  const mailColor = socials?.email?.color || "#2563EB";
  const mailBg = socials?.email?.bg || "#DBEAFE";

  const templateMessage = useMemo(() => {
    const lines = [
      `Halo PAWKOST!`,
      ``,
      `Nama: ${name || "(isi nama kamu)"}`,
      `Topik: ${topic}`,
      ``,
      `Pesan:`,
      `${message || "(tulis pesan kamu di sini)"}`,
      ``,
      `Terima kasih`,
    ];
    return lines.join("\n");
  }, [name, topic, message]);

  const waLink = useMemo(() => {
    const wa = socials?.whatsapp?.number || "";
    const txt = encodeURIComponent(templateMessage);
    return wa ? `https://wa.me/${wa}?text=${txt}` : "#";
  }, [socials, templateMessage]);

  const mailLink = useMemo(() => {
    const email = socials?.email?.address || "";
    const subject = encodeURIComponent(
      `[PAWKOST] ${topic} — ${name || "Anonim"}`
    );
    const body = encodeURIComponent(templateMessage);
    return email ? `mailto:${email}?subject=${subject}&body=${body}` : "#";
  }, [socials, topic, name, templateMessage]);

  const igLink = useMemo(() => socials?.instagram?.url || "#", [socials]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateMessage);
      alert("Pesan berhasil disalin ✅");
    } catch {
      alert("Gagal menyalin pesan.");
    }
  };

  return (
    <div
      className="
        rounded-2xl border border-gray-200 bg-white
        shadow-sm p-6
        transition-all duration-300
        hover:shadow-md
      "
    >
      <h3 className="text-xl font-bold text-gray-900">
        Kirim Pesan ke PAWKOST
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        Isi form, lalu pilih channel (WhatsApp / Email / Instagram).
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nama">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Owen"
              className="
                w-full rounded-xl border border-gray-200 bg-white
                px-4 py-2.5 outline-none
                text-gray-900 placeholder:text-gray-400
                focus:ring-2 focus:ring-gray-200 focus:border-gray-300
                transition
              "
            />
          </Field>

          <Field label="Topik">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="
                w-full rounded-xl border border-gray-200 bg-white
                px-4 py-2.5 outline-none
                text-gray-900
                focus:ring-2 focus:ring-gray-200 focus:border-gray-300
                transition
              "
            >
              <option>Kerja Sama</option>
              <option>Keluhan / Bantuan</option>
              <option>Masukan Fitur</option>
              <option>Promosi Kost</option>
              <option>Lainnya</option>
            </select>
          </Field>
        </div>

        <Field label="Pesan">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesan kamu..."
            rows={5}
            className="
              w-full rounded-xl border border-gray-200 bg-white
              px-4 py-3 outline-none resize-none
              text-gray-900 placeholder:text-gray-400
              focus:ring-2 focus:ring-gray-200 focus:border-gray-300
              transition
            "
          />
        </Field>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-gray-900">Preview Pesan</p>

            <button
              type="button"
              onClick={copyToClipboard}
              className="
                inline-flex items-center gap-2 text-xs font-bold
                px-3 py-1.5 rounded-full
                bg-white border border-gray-200
                text-gray-800
                transition-all duration-200
                hover:bg-gray-50
                active:scale-[0.98]
              "
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          <pre className="mt-3 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
            {templateMessage}
          </pre>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-2.5 font-bold
              border transition-all duration-200
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
            style={{
              borderColor: waColor,
              backgroundColor: waBg,
              color: "#0f172a",
            }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: waColor }} />
            WhatsApp
          </a>

          <a
            href={mailLink}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-2.5 font-bold
              border transition-all duration-200
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
            style={{
              borderColor: mailColor,
              backgroundColor: mailBg,
              color: "#0f172a",
            }}
          >
            <Mail className="w-5 h-5" style={{ color: mailColor }} />
            Email
          </a>

          <a
            href={igLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-2.5 font-bold
              border transition-all duration-200
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
            style={{
              borderColor: igColor,
              backgroundColor: igBg,
              color: "#0f172a",
            }}
            title="Buka Instagram PAWKOST, lalu paste pesan dari preview."
          >
            <Instagram className="w-5 h-5" style={{ color: igColor }} />
            Instagram
          </a>
        </div>

        <p className="text-xs text-gray-500">
          * Untuk Instagram, link membuka profil. Kamu tinggal paste pesan dari
          preview.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}