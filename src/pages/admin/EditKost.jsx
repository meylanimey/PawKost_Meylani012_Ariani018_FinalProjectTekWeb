import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function EditKost({ kosts = [], onEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const JENIS_KOST = useMemo(() => ["Campur", "Putra", "Putri", "Pet Friendly"], []);
  const DAERAH = useMemo(
    () => ["Yogyakarta", "Semarang", "Pontianak", "Bandung", "Kotawaringin Barat", "Bali", "Jakarta", "Medan"],
    []
  );
  const KAMPUS = useMemo(
    () => ["UAD", "UGM", "UNY", "UI", "ITB", "UPR", "UMY", "Untop", "Unair", "Undip", "Unpad", "Telkom"],
    []
  );

  const kost = useMemo(
    () => (kosts || []).find((k) => String(k.id) === String(id)),
    [kosts, id]
  );

  const [form, setForm] = useState({
    nama: "",
    urlGambar: "",
    jenis: "Campur",
    harga: "",
    status: "Tersedia",
    daerah: "Yogyakarta",
    kampus: "UAD",
    lokasi: "",
    fasilitasInput: "",
    fasilitas: [],
    deskripsi: "",
  });

  // ✅ PREFILL EDIT: mapping lebih kuat (harga, lokasi, deskripsi, fasilitas pasti kebaca)
  useEffect(() => {
    if (!kost) return;

    const nama = kost.nama ?? kost.name ?? kost.namaKost ?? "";

    const urlGambar =
      kost.urlGambar ?? kost.gambar ?? kost.image ?? kost.imageUrl ?? kost.foto ?? "";

    const jenis = kost.jenis ?? kost.jenisKost ?? "Campur";

    const hargaRaw = kost.harga ?? kost.hargaSewa ?? kost.harga_sewa ?? kost.price ?? "";
    const harga = String(hargaRaw ?? "");

    const status = kost.status ?? kost.ketersediaan ?? "Tersedia";

    const daerah = kost.daerah ?? kost.kota ?? kost.daerahKota ?? "Yogyakarta";

    const kampus = kost.kampus ?? kost.areaKampus ?? kost.kampusArea ?? "UAD";

    const lokasi = kost.lokasi ?? kost.alamat ?? kost.lokasiAlamat ?? kost.address ?? "";

    const deskripsi = kost.deskripsi ?? kost.description ?? kost.desc ?? "";

    const fasilitasRaw = kost.fasilitas ?? kost.facilities ?? kost.fasilitasKost ?? [];

    const fasilitas = Array.isArray(fasilitasRaw)
      ? fasilitasRaw
      : String(fasilitasRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    setForm({
      nama,
      urlGambar,
      jenis,
      harga,
      status,
      daerah,
      kampus,
      lokasi,
      fasilitasInput: "",
      fasilitas,
      deskripsi,
    });
  }, [kost]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const addFacility = (name) => {
    const cleaned = (name || "").trim();
    if (!cleaned) return;

    setForm((p) => {
      const exists = p.fasilitas.some((f) => f.toLowerCase() === cleaned.toLowerCase());
      if (exists) return { ...p, fasilitasInput: "" };
      return { ...p, fasilitas: [...p.fasilitas, cleaned], fasilitasInput: "" };
    });
  };

  const removeFacility = (name) => {
    setForm((p) => ({ ...p, fasilitas: p.fasilitas.filter((f) => f !== name) }));
  };

  const handleSubmit = () => {
    if (!kost) return;

    const updated = {
      ...kost,
      id: kost.id,
      nama: form.nama,
      urlGambar: form.urlGambar,
      jenis: form.jenis,
      harga: form.harga,
      hargaSewa: form.harga, // ✅ biar aman kalau tabel pakai hargaSewa
      status: form.status,
      daerah: form.daerah,
      kampus: form.kampus,
      lokasi: form.lokasi,
      alamat: form.lokasi, // ✅ biar aman kalau tabel pakai alamat
      fasilitas: form.fasilitas,
      deskripsi: form.deskripsi,
    };

    if (typeof onEdit === "function") onEdit(updated);
    navigate("/admin/kost", { replace: true });
  };

  // ===== Styling (SAMA seperti tambah) =====
  const labelClass = "mb-1 block text-[16px] font-semibold text-[#734128]";
  const titleClass = "text-[#734128] font-extrabold text-[40px] leading-tight";
  const subtitleClass = "mt-1 text-[20px] font-normal text-[#734128]";

  const inputClass = "border-[#B7AB92] bg-white text-[#734128] focus-visible:ring-[#B7AB92]";

  const dropdownClass =
    "w-full appearance-none rounded-md border border-[#B7AB92] bg-[#F0E3D0] " +
    "px-4 py-2 pr-12 text-sm text-[#734128] outline-none " +
    "shadow-[inset_0_2px_8px_rgba(0,0,0,0.14)] " +
    "focus:ring-2 focus:ring-[#B7AB92]";

  const actionBtnClass = "bg-[#6b4b34] text-white font-bold hover:bg-[#5b3f2c]";

  const chipClass =
    "flex items-center gap-2 rounded-md border border-[#B7AB92] bg-[#F0E3D0] px-3 py-1 " +
    "text-xs font-semibold text-[#734128] shadow-[inset_0_2px_8px_rgba(0,0,0,0.14)]";

  const Dropdown = ({ label, required, value, onChange, options }) => (
    <div className="relative">
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select value={value} onChange={(e) => onChange(e.target.value)} className={dropdownClass}>
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

  if (!kost) {
    return (
      <div className="bg-white">
        <h1 className={titleClass}>Edit Data Kost</h1>
        <p className={subtitleClass}>Data kost tidak ditemukan</p>

        <div className="mt-6">
          <Button className={actionBtnClass} onClick={() => navigate("/admin/kost")}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white">
      <div className="mb-4">
        <h1 className={titleClass}>Edit Data Kost</h1>
        <p className={subtitleClass}>Perbarui informasi kost yang sesuai dan lengkap</p>
      </div>

      <div className="rounded-2xl border border-[#D9CBB4] bg-[#F3EDE3] p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          {/* LEFT */}
          <div className="p-3 lg:border-r lg:border-[#D9CBB4]">
            <div className="mb-3">
              <label className={labelClass}>
                Nama Kost <span className="text-red-500">*</span>
              </label>
              <Input value={form.nama} onChange={(e) => setField("nama", e.target.value)} className={inputClass} />
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dropdown label="Jenis Kost" required value={form.jenis} onChange={(v) => setField("jenis", v)} options={JENIS_KOST} />

              <div>
                <label className={labelClass}>
                  Harga Sewa <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-md border border-[#B7AB92] bg-white px-3 py-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.10)] focus-within:ring-2 focus-within:ring-[#B7AB92]">
                  <span className="text-sm font-semibold text-[#734128]">Rp.</span>
                  <input
                    className="ml-2 w-full bg-transparent text-sm text-[#734128] outline-none placeholder:text-[#9a856e]"
                    placeholder="Per Bulan"
                    value={form.harga}
                    onChange={(e) => setField("harga", e.target.value)}
                    inputMode="numeric"
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
                  />
                  Tersedia
                </label>
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === "Penuh"}
                    onChange={() => setField("status", "Penuh")}
                  />
                  Penuh
                </label>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dropdown label="Daerah/Kota" required value={form.daerah} onChange={(v) => setField("daerah", v)} options={DAERAH} />
              <Dropdown label="Area Kampus" required value={form.kampus} onChange={(v) => setField("kampus", v)} options={KAMPUS} />
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
                />
                <Button type="button" className={actionBtnClass} onClick={() => addFacility(form.fasilitasInput)}>
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
                        className="rounded-full p-1 hover:bg-[#e4d6c2]"
                        title="Hapus fasilitas"
                      >
                        <X size={14} className="text-[#734128]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-3">
            <div className="mb-3">
              <label className={labelClass}>
                URL Gambar <span className="text-red-500">*</span>
              </label>
              <Input value={form.urlGambar} onChange={(e) => setField("urlGambar", e.target.value)} className={inputClass} />
            </div>

            <div className="mb-3">
              <div className="flex h-[190px] w-full items-center justify-center overflow-hidden rounded-xl bg-transparent">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full rounded-xl object-cover" />
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
                           focus:ring-2 focus:ring-[#B7AB92]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" className={actionBtnClass} onClick={() => navigate("/admin/kost")}>
          Batal
        </Button>
        <Button type="button" className={actionBtnClass} onClick={handleSubmit}>
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
