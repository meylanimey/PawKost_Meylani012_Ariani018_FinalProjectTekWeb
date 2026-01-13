import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { USERS_ENDPOINT } from "@/api/mockapi";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const ROLES = useMemo(() => ["user", "admin"], []);
  const STATUS = useMemo(() => ["Aktif", "Nonaktif"], []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    status: "Aktif",
    avatar: "",
    createdAt: "",
  });

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const normalizePhone = (raw) => String(raw || "").replace(/\D/g, "");
  const safeTrim = (v) => String(v ?? "").trim();

  useEffect(() => {
    let alive = true;

    async function load() {
      setErr("");
      setLoading(true);

      try {
        const res = await fetch(`${USERS_ENDPOINT}/${id}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil detail. (${res.status}) ${text}`);
        }
        const u = await res.json();

        const name = u.name ?? u.nama ?? "";
        const email = u.email ?? "";
        const phone = u.phone ?? u.telp ?? "";
        const password = u.password ?? "";
        const role = u.role ?? "user";
        const status = u.status ?? "Aktif";
        const avatar = u.avatar ?? "";
        const createdAt = u.createdAt ?? "";

        if (!alive) return;

        setForm({
          name: String(name),
          email: String(email),
          phone: String(phone),
          password: String(password),
          role: role === "admin" ? "admin" : "user",
          status: status === "Nonaktif" ? "Nonaktif" : "Aktif",
          avatar: String(avatar),
          createdAt: createdAt ? String(createdAt) : "",
        });
      } catch (e) {
        if (alive) setErr(e?.message || "Gagal ambil data");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  const validate = () => {
    const errors = [];

    if (!safeTrim(form.name)) errors.push("Nama wajib diisi");
    if (!safeTrim(form.email)) errors.push("Email wajib diisi");
    if (!safeTrim(form.phone)) errors.push("No. telepon wajib diisi");
    if (!safeTrim(form.password)) errors.push("Password wajib diisi");
    if (!ROLES.includes(form.role)) errors.push("Role tidak valid");
    if (!STATUS.includes(form.status)) errors.push("Status tidak valid");

    const phoneDigits = normalizePhone(form.phone);
    if (!phoneDigits)
      errors.push("No. telepon harus angka (contoh: 08xxxx / 62xxxx)");

    return { ok: errors.length === 0, errors, phoneDigits };
  };

  const handleSubmit = async () => {
    setErr("");
    const v = validate();
    if (!v.ok) {
      setErr(v.errors.join("\n"));
      return;
    }

    const createdAtFinal = safeTrim(form.createdAt) || new Date().toISOString();

    const payload = {
      name: safeTrim(form.name),
      email: safeTrim(form.email),
      phone: v.phoneDigits,
      password: String(form.password),
      role: form.role,
      status: form.status,
      avatar: safeTrim(form.avatar),
      createdAt: createdAtFinal,
      updatedAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      const res = await fetch(`${USERS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal simpan. (${res.status}) ${text}`);
      }

      await res.json();
      alert("Berhasil simpan perubahan!");
      navigate("/admin/users", { replace: true });
    } catch (e) {
      setErr(e?.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "mb-1 block text-[16px] font-semibold text-[#734128]";
  const titleClass = "text-[#734128] font-extrabold text-[40px] leading-tight";
  const subtitleClass = "mt-1 text-[20px] font-normal text-[#734128]";

  const inputClass =
    "border-[#B7AB92] bg-white text-[#734128] focus-visible:ring-[#B7AB92]";

  const dropdownClass =
    "w-full appearance-none rounded-md border border-[#B7AB92] bg-[#F0E3D0] " +
    "px-4 py-2 pr-12 text-sm text-[#734128] outline-none " +
    "shadow-[inset_0_2px_8px_rgba(0,0,0,0.14)] " +
    "focus:ring-2 focus:ring-[#B7AB92]";

  const actionBtnClass =
    "bg-[#6b4b34] text-white font-bold hover:bg-[#5b3f2c] disabled:opacity-60";

  const Dropdown = ({ label, required, value, onChange, options }) => (
    <div className="relative">
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={dropdownClass}
        disabled={loading || saving}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-[44px] -translate-y-1/2 text-[#734128]"
      />
    </div>
  );

  const avatarPreview = safeTrim(form.avatar);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-white">
        <h1 className={titleClass}>Edit Data User</h1>
        <p className={subtitleClass}>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white">
      <div className="mb-4">
        <h1 className={titleClass}>Edit Data User</h1>
        <p className={subtitleClass}>
          Perbarui informasi user yang sesuai dan lengkap
        </p>
      </div>

      {!!err && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-line">
          {err}
        </div>
      )}

      <div className="rounded-2xl border border-[#D9CBB4] bg-[#F3EDE3] p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          {/* LEFT */}
          <div className="p-3 lg:border-r lg:border-[#D9CBB4]">
            <div className="mb-3">
              <label className={labelClass}>
                Nama <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
              <p className="mt-1 text-xs text-[#9a856e]">
                * Email dipakai untuk login. Pastikan benar.
              </p>
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="08xxxxxxxxxx / 62xxxxxxxxxx"
                className={inputClass}
                inputMode="numeric"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-[#9a856e]">
                Nomor akan disimpan dalam format angka saja.
              </p>
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
              <p className="mt-1 text-xs text-[#9a856e]">
                Catatan: ini mock project, password masih plain text.
              </p>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dropdown
                label="Role"
                required
                value={form.role}
                onChange={(v) => setField("role", v)}
                options={ROLES}
              />
              <Dropdown
                label="Status Akun"
                required
                value={form.status}
                onChange={(v) => setField("status", v)}
                options={STATUS}
              />
            </div>

            <div className="mb-3">
              <label className={labelClass}>Created At (opsional)</label>
              <Input
                value={form.createdAt}
                onChange={(e) => setField("createdAt", e.target.value)}
                placeholder="2026-01-12T00:00:00.000Z"
                className={inputClass}
                disabled={saving}
              />
              <p className="mt-1 text-xs text-[#9a856e]">
                Kalau dikosongkan akan otomatis diisi sekarang.
              </p>
            </div>
          </div>

          <div className="p-3">
            <div className="mb-3">
              <label className={labelClass}>URL Avatar (opsional)</label>
              <Input
                value={form.avatar}
                onChange={(e) => setField("avatar", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <div className="flex h-[190px] w-full items-center justify-center overflow-hidden rounded-xl bg-transparent">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview Avatar"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-[#D9CBB4] bg-white text-[16px] text-[#734128]">
                    Preview avatar akan muncul di sini
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#D9CBB4] bg-white p-3">
              <p className="text-sm font-semibold text-[#734128]">Catatan</p>
              <p className="text-xs text-[#9a856e]">
                Role "admin" akan punya akses halaman admin (jika route kamu
                protect via role), sedangkan "user" hanya akses public.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          className={actionBtnClass}
          onClick={() => navigate("/admin/users")}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          type="button"
          className={actionBtnClass}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
