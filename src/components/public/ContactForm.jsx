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
    return [
      `Halo PAWKOST!`,
      ``,
      `Nama: ${name || "(isi nama kamu)"}`,
      `Topik: ${topic}`,
      ``,
      `Pesan:`,
      `${message || "(tulis pesan kamu di sini)"}`,
      ``,
      `Terima kasih`,
    ].join("\n");
  }, [name, topic, message]);

  const waLink = useMemo(() => {
    const wa = socials?.whatsapp?.number || "";
    return wa
      ? `https://wa.me/${wa}?text=${encodeURIComponent(templateMessage)}`
      : "#";
  }, [socials, templateMessage]);

  const mailLink = useMemo(() => {
    const email = socials?.email?.address || "";
    return email
      ? `mailto:${email}?subject=${encodeURIComponent(
          `[PAWKOST] ${topic} — ${name || "Anonim"}`
        )}&body=${encodeURIComponent(templateMessage)}`
      : "#";
  }, [socials, topic, name, templateMessage]);

  const igLink = useMemo(() => socials?.instagram?.url || "#", [socials]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(templateMessage);
    alert("Pesan berhasil disalin ✅");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#5C4033]">
        Kirim Pesan ke PAWKOST
      </h3>

      <p className="text-sm text-[#8B6F47] mt-1">
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
                text-[#8B6F47] placeholder:text-[#B59B84]
                focus:ring-2 focus:ring-[#E7D8C9]
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
                text-[#8B6F47]
                focus:ring-2 focus:ring-[#E7D8C9]
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
              text-[#8B6F47] placeholder:text-[#B59B84]
              focus:ring-2 focus:ring-[#E7D8C9]
            "
          />
        </Field>

        <div className="rounded-2xl border border-gray-200 bg-[#FFF7ED] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#5C4033]">Preview Pesan</p>

            <button
              type="button"
              onClick={copyToClipboard}
              className="
                inline-flex items-center gap-2
                text-xs font-bold text-[#5C4033]
                px-3 py-1.5 rounded-full
                border border-[#E7D8C9] bg-white
              "
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          <pre className="mt-3 text-xs text-[#8B6F47] whitespace-pre-wrap">
            {templateMessage}
          </pre>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={waLink}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold border"
            style={{
              borderColor: waColor,
              backgroundColor: waBg,
              color: "#5C4033",
            }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: waColor }} />
            WhatsApp
          </a>

          <a
            href={mailLink}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold border"
            style={{
              borderColor: mailColor,
              backgroundColor: mailBg,
              color: "#5C4033",
            }}
          >
            <Mail className="w-5 h-5" style={{ color: mailColor }} />
            Email
          </a>

          <a
            href={igLink}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold border"
            style={{
              borderColor: igColor,
              backgroundColor: igBg,
              color: "#5C4033",
            }}
          >
            <Instagram className="w-5 h-5" style={{ color: igColor }} />
            Instagram
          </a>
        </div>

        <p className="text-xs text-[#8B6F47]">
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
      <span className="text-sm font-bold text-[#5C4033]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}