import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "@/api/mockapi";

export default function SettingsProfile() {
  const navigate = useNavigate();
  const abortRef = useRef(null);

  const [me, setMe] = useState(() => readLocalUser());

  const [name, setName] = useState(me?.name || "");
  const [phone, setPhone] = useState(me?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(me?.avatar || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const normalizePhone = (raw) => String(raw || "").replace(/\D/g, "");
  const safeTrim = (v) => String(v ?? "").trim();

  useEffect(() => {
    const local = readLocalUser();
    setMe(local);

    if (!local?.id) {
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      setErr("");
      setMsg("");
      setLoading(true);

      try {
        const res = await fetch(`${USERS_ENDPOINT}/${local.id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal memuat profil. (${res.status}) ${text}`);
        }

        const fresh = await res.json();

        const merged = { ...(local || {}), ...(fresh || {}) };
        setMe(merged);

        setName(merged?.name || "");
        setPhone(merged?.phone || "");
        setAvatarUrl(merged?.avatar || "");

        localStorage.setItem("paw_user", JSON.stringify(merged));
        window.dispatchEvent(new Event("paw_auth_change"));
      } catch (e) {
        if (e?.name === "AbortError") return;
        setErr(e?.message || "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const avatarSrc = useMemo(
    () => safeTrim(avatarUrl) || me?.avatar || "/images/cat.png",

    [avatarUrl, me?.avatar]
  );

  const savePatch = async (patch, successMsg) => {
    if (!me?.id) return;

    setSaving(true);
    setErr("");
    setMsg("");

    try {
      const payload = {
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`${USERS_ENDPOINT}/${me.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal menyimpan. (${res.status}) ${text}`);
      }

      const updated = await res.json();

      setMe(updated);
      localStorage.setItem("paw_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("paw_auth_change"));

      setMsg(successMsg || "Perubahan tersimpan.");
    } catch (e) {
      setErr(e?.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const onSaveProfile = async (e) => {
    e.preventDefault();

    const nameV = safeTrim(name);
    const phoneDigits = normalizePhone(phone);

    if (!nameV) {
      setErr("Nama wajib diisi.");
      return;
    }
    if (!phoneDigits) {
      setErr("No telepon wajib diisi (angka saja).");
      return;
    }

    await savePatch(
      { name: nameV, phone: phoneDigits },
      "Perubahan profil tersimpan."
    );
  };

  const onSaveAvatar = async () => {
    const url = safeTrim(avatarUrl);

    if (url && !/^https?:\/\/.+/i.test(url)) {
      setErr("Avatar harus berupa URL valid (diawali http:// atau https://).");
      return;
    }

    await savePatch({ avatar: url }, "Avatar berhasil diperbarui.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6EBD8] flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white p-6 shadow border border-[#E5D5C0] text-center">
          <div className="font-bold text-[#754A34]">Memuat profil...</div>
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
              Kelola profil kamu (nama, telepon, avatar URL).
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

                <div className="flex-1">
                  <div className="text-xl font-extrabold text-[#6B4B3B]">
                    {me.name}
                  </div>
                  <div className="text-sm text-[#8B6F5C] font-semibold">
                    {me.email}
                  </div>

                  <div className="mt-3 space-y-2">
                    <Field label="URL Avatar (opsional)">
                      <input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://....jpg/png"
                        className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                                   shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                                   outline-none ring-1 ring-black/5
                                   focus:ring-2 focus:ring-black/10 transition"
                        disabled={saving}
                      />
                    </Field>

                    <button
                      type="button"
                      onClick={onSaveAvatar}
                      disabled={saving}
                      className="rounded-full bg-[#C6A892] px-4 py-2 text-sm font-bold text-white
                                 hover:brightness-95 transition shadow disabled:opacity-60"
                    >
                      {saving ? "Menyimpan..." : "Simpan Avatar"}
                    </button>
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
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 whitespace-pre-line">
                  {err}
                </div>
              )}

              <form onSubmit={onSaveProfile} className="space-y-5">
                <Field label="Nama">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                               shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                               outline-none ring-1 ring-black/5
                               focus:ring-2 focus:ring-black/10 transition"
                    placeholder="Nama kamu"
                    disabled={saving}
                  />
                </Field>

                <Field label="Email (tidak bisa diubah)">
                  <input
                    value={me.email || ""}
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
                    disabled={saving}
                    inputMode="numeric"
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

function readLocalUser() {
  try {
    const raw = localStorage.getItem("paw_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}