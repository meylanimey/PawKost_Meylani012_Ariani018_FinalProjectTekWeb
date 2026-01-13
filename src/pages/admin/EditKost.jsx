import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { KOSTS_ENDPOINT } from "@/api/mockapi";

export default function EditKost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const JENIS_KOST = useMemo(
    () => ["Campur", "Putra", "Putri", "Pet Friendly"],
    []
  );
  const DAERAH = useMemo(
    () => [
      "Yogyakarta",
      "Semarang",
      "Pontianak",
      "Bandung",
      "Kotawaringin Barat",
      "Bali",
      "Jakarta",
      "Medan",
    ],
    []
  );
  const KAMPUS = useMemo(
    () => [
      "UAD",
      "UGM",
      "UNY",
      "UI",
      "ITB",
      "UPR",
      "UMY",
      "Untop",
      "Unair",
      "Undip",
      "Unpad",
      "Telkom",
    ],
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    nama: "",
    urlGambar: "",
    nomorPemilik: "",
    jenis: "Campur",
    harga: "",
    status: "Tersedia",
    daerah: "Yogyakarta",
    kampus: "UAD",
    lokasi: "",
    fasilitasInput: "",
    fasilitas: [],
    deskripsi: "",
    isPublished: false,
  });

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const normalizePhone = (raw) => String(raw || "").replace(/\D/g, "");

  const addFacility = (name) => {
    const cleaned = (name || "").trim();
    if (!cleaned) return;

    setForm((p) => {
      const exists = p.fasilitas.some(
        (f) => f.toLowerCase() === cleaned.toLowerCase()
      );
      if (exists) return { ...p, fasilitasInput: "" };
      return { ...p, fasilitas: [...p.fasilitas, cleaned], fasilitasInput: "" };
    });
  };

  const removeFacility = (name) => {
    setForm((p) => ({
      ...p,
      fasilitas: p.fasilitas.filter((f) => f !== name),
    }));
  };

  useEffect(() => {
    let alive = true;

    async function load() {
      setErr("");
      setLoading(true);
      try {
        const res = await fetch(`${KOSTS_ENDPOINT}/${id}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil detail. (${res.status}) ${text}`);
        }
        const kost = await res.json();

        const nama = kost.nama ?? kost.name ?? kost.namaKost ?? "";
        const urlGambar =
          kost.urlGambar ??
          kost.gambar ??
          kost.image ??
          kost.imageUrl ??
          kost.foto ??
          "";
        const nomorPemilik = kost.nomorPemilik ?? kost.wa ?? kost.phone ?? "";
        const jenis = kost.jenis ?? kost.type ?? "Campur";

        const hargaRaw =
          kost.harga ?? kost.hargaSewa ?? kost.harga_sewa ?? kost.price ?? "";
        const harga = String(hargaRaw ?? "");

        const status = kost.status ?? kost.ketersediaan ?? "Tersedia";
        const daerah =
          kost.daerah ?? kost.kota ?? kost.daerahKota ?? "Yogyakarta";
        const kampus =
          kost.kampus ?? kost.areaKampus ?? kost.kampusArea ?? "UAD";
        const lokasi =
          kost.lokasi ??
          kost.alamat ??
          kost.lokasiAlamat ??
          kost.location ??
          kost.address ??
          "";

        const deskripsi = kost.deskripsi ?? kost.description ?? kost.desc ?? "";
        const fasilitasRaw =
          kost.fasilitas ?? kost.facilities ?? kost.fasilitasKost ?? [];
        const fasilitas = Array.isArray(fasilitasRaw)
          ? fasilitasRaw
          : String(fasilitasRaw)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

        const isPublished = !!(kost.isPublished ?? false);

        if (!alive) return;

        setForm({
          nama,
          urlGambar,
          nomorPemilik: String(nomorPemilik),
          jenis,
          harga,
          status,
          daerah,
          kampus,
          lokasi,
          fasilitasInput: "",
          fasilitas,
          deskripsi,
          isPublished,
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
    if (!form.nama.trim()) errors.push("Nama kost wajib diisi");
    if (!form.urlGambar.trim()) errors.push("URL gambar wajib diisi");
    if (!form.lokasi.trim()) errors.push("Lokasi/alamat wajib diisi");
    if (!form.deskripsi.trim()) errors.push("Deskripsi wajib diisi");
    if (form.fasilitas.length === 0) errors.push("Minimal 1 fasilitas");

    const hargaNum = Number(String(form.harga).replace(/[^\d]/g, ""));
    if (!hargaNum) errors.push("Harga wajib angka (contoh: 850000)");

    const wa = normalizePhone(form.nomorPemilik);
    if (!wa) errors.push("Nomor pemilik (WhatsApp) wajib diisi");

    return { ok: errors.length === 0, errors, hargaNum, wa };
  };

  const handleSubmit = async () => {
    setErr("");
    const v = validate();
    if (!v.ok) {
      setErr(v.errors.join("\n"));
      return;
    }

    const nowIso = new Date().toISOString();

    const payload = {
      nama: form.nama.trim(),
      urlGambar: form.urlGambar.trim(),
      nomorPemilik: v.wa,
      jenis: form.jenis,
      harga: v.hargaNum,
      status: form.status,
      daerah: form.daerah,
      kampus: form.kampus,
      lokasi: form.lokasi.trim(),
      fasilitas: form.fasilitas,
      deskripsi: form.deskripsi.trim(),
      isPublished: !!form.isPublished,
      updatedAt: nowIso,
    };

    setSaving(true);
    try {
      const res = await fetch(`${KOSTS_ENDPOINT}/${id}`, {
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
      navigate("/admin/kost", { replace: true });
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

  const chipClass =
    "flex items-center gap-2 rounded-md border border-[#B7AB92] bg-[#F0E3D0] px-3 py-1 " +
    "text-xs font-semibold text-[#734128] shadow-[inset_0_2px_8px_rgba(0,0,0,0.14)]";

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

  const imagePreview = (form.urlGambar || "").trim();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-white">
        <h1 className={titleClass}>Edit Data Kost</h1>
        <p className={subtitleClass}>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white">
      <div className="mb-4">
        <h1 className={titleClass}>Edit Data Kost</h1>
        <p className={subtitleClass}>
          Perbarui informasi kost yang sesuai dan lengkap
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
                Nama Kost <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.nama}
                onChange={(e) => setField("nama", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Nomor Pemilik (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.nomorPemilik}
                onChange={(e) => setField("nomorPemilik", e.target.value)}
                placeholder="6281234567890"
                className={inputClass}
                inputMode="numeric"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-[#9a856e]">
                Gunakan format 62xxxxxxxxxxx (tanpa +, spasi, atau tanda -)
              </p>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dropdown
                label="Jenis Kost"
                required
                value={form.jenis}
                onChange={(v) => setField("jenis", v)}
                options={JENIS_KOST}
              />

              <div>
                <label className={labelClass}>
                  Harga Sewa <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-md border border-[#B7AB92] bg-white px-3 py-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.10)] focus-within:ring-2 focus-within:ring-[#B7AB92]">
                  <span className="text-sm font-semibold text-[#734128]">
                    Rp.
                  </span>
                  <input
                    className="ml-2 w-full bg-transparent text-sm text-[#734128] outline-none placeholder:text-[#9a856e] disabled:opacity-60"
                    placeholder="Per Bulan"
                    value={form.harga}
                    onChange={(e) => setField("harga", e.target.value)}
                    inputMode="numeric"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Status Ketersediaan <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex gap-8 text-[16px] text-[#734128]">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === "Tersedia"}
                    onChange={() => setField("status", "Tersedia")}
                    disabled={saving}
                  />
                  Tersedia
                </label>
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === "Penuh"}
                    onChange={() => setField("status", "Penuh")}
                    disabled={saving}
                  />
                  Penuh
                </label>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dropdown
                label="Daerah/Kota"
                required
                value={form.daerah}
                onChange={(v) => setField("daerah", v)}
                options={DAERAH}
              />
              <Dropdown
                label="Area Kampus"
                required
                value={form.kampus}
                onChange={(v) => setField("kampus", v)}
                options={KAMPUS}
              />
            </div>

            <div className="mb-3">
              <label className={labelClass}>
                Lokasi / Alamat Kost <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.lokasi}
                onChange={(e) => setField("lokasi", e.target.value)}
                placeholder="Jl. Ki Ageng Pemanahan..."
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div>
              <label className={labelClass}>
                Fasilitas <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-3">
                <Input
                  value={form.fasilitasInput}
                  onChange={(e) => setField("fasilitasInput", e.target.value)}
                  placeholder="Isi disini..."
                  className={inputClass}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFacility(form.fasilitasInput);
                    }
                  }}
                  disabled={saving}
                />
                <Button
                  type="button"
                  className={actionBtnClass}
                  onClick={() => addFacility(form.fasilitasInput)}
                  disabled={saving}
                >
                  Tambah
                </Button>
              </div>

              {form.fasilitas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.fasilitas.map((f) => (
                    <div key={f} className={chipClass}>
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => removeFacility(f)}
                        className="rounded-full p-1 hover:bg-[#e4d6c2] disabled:opacity-60"
                        title="Hapus fasilitas"
                        disabled={saving}
                      >
                        <X size={14} className="text-[#734128]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-3">
            <div className="mb-3">
              <label className={labelClass}>
                URL Gambar <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.urlGambar}
                onChange={(e) => setField("urlGambar", e.target.value)}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <div className="flex h-[190px] w-full items-center justify-center overflow-hidden rounded-xl bg-transparent">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-[#D9CBB4] bg-white text-[16px] text-[#734128]">
                    Preview gambar akan muncul di sini
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setField("deskripsi", e.target.value)}
                className="min-h-[110px] w-full rounded-md border border-[#B7AB92] bg-white px-4 py-2 text-sm
                           text-[#734128] outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.10)]
                           focus:ring-2 focus:ring-[#B7AB92] disabled:opacity-60"
                disabled={saving}
              />
            </div>

            <div className="mt-4 rounded-xl border border-[#D9CBB4] bg-white p-3">
              <p className="text-sm font-semibold text-[#734128]">
                Status Publish
              </p>
              <p className="text-xs text-[#9a856e]">
                Draft tidak tampil di halaman user sebelum dipublish.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.isPublished}
                  onChange={(e) => setField("isPublished", e.target.checked)}
                  disabled={saving}
                />
                <span className="text-sm text-[#734128]">Publish sekarang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          className={actionBtnClass}
          onClick={() => navigate("/admin/kost")}
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
