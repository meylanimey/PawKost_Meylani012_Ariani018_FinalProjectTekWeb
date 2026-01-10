import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth";

export default function SettingsProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [me, setMe] = useState(() => getCurrentUser());
  const [name, setName] = useState(me?.name || "");
  const [phone, setPhone] = useState(me?.phone || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const u = getCurrentUser();
    setMe(u);
    setName(u?.name || "");
    setPhone(u?.phone || "");
  }, []);

  const avatarSrc = useMemo(() => me?.avatar || "/images/cat.png", [me]);

  const pickFile = () => fileRef.current?.click();

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErr("File harus gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErr("Ukuran gambar max 2MB.");
      return;
    }

    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });

    try {
      setErr("");
      setMsg("");
      const dataUrl = await toDataURL(file);

      const updated = updateCurrentUser({ avatar: dataUrl });
      setMe(updated);
      setMsg("Foto profil diperbarui.");

      window.dispatchEvent(new Event("pawkost:auth"));
    } catch {
      setErr("Gagal update foto.");
    } finally {
      e.target.value = "";
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");

    try {
      const updated = updateCurrentUser({ name, phone });
      setMe(updated);
      setMsg("Perubahan tersimpan.");

      window.dispatchEvent(new Event("pawkost:auth"));
    } catch (e2) {
      setErr(e2?.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (!me) {
    return (
      <div className="min-h-screen bg-[#F6EBD8] flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white p-6 shadow border border-[#E5D5C0] text-center">
          <div className="font-bold text-[#754A34] mb-2">Kamu belum login</div>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#C6A892] px-5 py-2 font-semibold text-white"
          >
            Ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EBD8] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2
                     text-sm font-semibold text-[#6B4B3B] shadow hover:brightness-95 border border-[#E5D5C0]"
        >
          ← Kembali
        </button>

        <div className="rounded-3xl bg-white shadow border border-[#E5D5C0] overflow-hidden">
          <div className="px-7 sm:px-10 py-8 bg-gradient-to-r from-[#F7EEDB] to-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#754A34]">
              Settings Profile
            </h1>
            <p className="mt-2 text-[#8B6F5C] font-semibold">
              Kelola profil kamu (nama, telepon, foto).
            </p>
          </div>

          <div className="px-7 sm:px-10 py-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D9C3AF] bg-white shadow">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-xl font-extrabold text-[#6B4B3B]">
                    {me.name}
                  </div>
                  <div className="text-sm text-[#8B6F5C] font-semibold">
                    {me.email}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={pickFile}
                      className="rounded-full bg-[#C6A892] px-4 py-2 text-sm font-bold text-white
                                 hover:brightness-95 transition shadow"
                    >
                      Ganti Foto
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onAvatarChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {msg && (
                <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                  {msg}
                </div>
              )}
              {err && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {err}
                </div>
              )}

              <form onSubmit={onSave} className="space-y-5">
                <Field label="Nama">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                               shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                               outline-none ring-1 ring-black/5
                               focus:ring-2 focus:ring-black/10 transition"
                    placeholder="Nama kamu"
                  />
                </Field>

                <Field label="Email (tidak bisa diubah)">
                  <input
                    value={me.email}
                    disabled
                    className="w-full rounded-[18px] bg-gray-50 px-6 py-4 text-[16px] text-[#6B4B3B]
                               ring-1 ring-black/5"
                  />
                </Field>

                <Field label="No Telepon">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                               shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                               outline-none ring-1 ring-black/5
                               focus:ring-2 focus:ring-black/10 transition"
                    placeholder="08xxxxxxxxxx"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 w-full rounded-[22px] bg-[#C6A892] px-8 py-4 text-[20px] font-semibold text-white
                             shadow-[0_14px_30px_rgba(0,0,0,0.12)]
                             hover:brightness-95 active:scale-[0.99] transition
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ TEKS FOOTER SUDAH DIHILANGKAN */}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-semibold text-[#8B6F5C]">
        {label}
      </label>
      {children}
    </div>
  );
}
