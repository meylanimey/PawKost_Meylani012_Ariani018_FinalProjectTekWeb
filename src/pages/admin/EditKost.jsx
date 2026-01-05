import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

function formatRupiah(n) {
  const num = Number(n || 0);
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function EditKost({ kosts = [], onEdit = () => {} }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const current = useMemo(
    () => kosts.find((k) => String(k.id) === String(id)),
    [kosts, id]
  );

  // ===== form state =====
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Tersedia");

  // fasilitas chip + input
  const [facilities, setFacilities] = useState([]);
  const [facilityInput, setFacilityInput] = useState("");

  // Isi form dari data existing
  useEffect(() => {
    if (!current) return;

    setName(current.name ?? "");
    setType(current.type ?? "");
    setPrice(String(current.price ?? ""));
    // address bisa datang dari "address" atau "location" (biar kompatibel)
    setAddress(current.address ?? current.location ?? "");
    setImage(current.image ?? "");
    setDescription(current.description ?? "");
    setStatus(current.status ?? "Tersedia");
    setFacilities(Array.isArray(current.facilities) ? current.facilities : []);
  }, [current]);

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Nama kost tidak boleh kosong";
    if (!type) e.type = "Tipe kost harus dipilih";
    if (!String(price).trim()) e.price = "Harga per bulan harus di isi";
    if (!address.trim()) e.address = "Alamat tidak boleh kosong";
    if (!description.trim()) e.description = "Deskripsi tidak boleh kosong";
    if (!image.trim()) e.image = "URL gambar wajib diisi";
    return e;
  }, [name, type, price, address, description, image]);

  const isValid = Object.keys(errors).length === 0;

  const addFacility = (raw) => {
    const val = String(raw || "").trim();
    if (!val) return;

    const exists = facilities.some(
      (f) => String(f).toLowerCase() === val.toLowerCase()
    );
    if (exists) return;

    setFacilities((prev) => [...prev, val]);
  };

  const removeFacility = (val) => {
    setFacilities((prev) => prev.filter((f) => f !== val));
  };

  const handleFacilityKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFacility(facilityInput);
      setFacilityInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!current || !isValid) return;

    const trimmedAddress = address.trim();

    const updated = {
      ...current,
      name: name.trim(),
      type,
      price: Number(price),
      address: trimmedAddress,
      // ✅ penting: public kamu pakai location, jadi kita update juga
      location: trimmedAddress,
      image: image.trim(),
      description: description.trim(),
      facilities,
      status,
    };

    onEdit(updated);
    navigate("/admin");
  };

  if (!current) {
    return (
      <div className="rounded-2xl border border-[#EFEAE2] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-[#734128]">Data tidak ditemukan</h1>
        <p className="mt-1 text-sm text-[#734128]/70">
          Kost dengan ID <b>{id}</b> tidak ada.
        </p>
        <Button
          className="mt-4 rounded-xl !bg-[#734128] !text-white hover:!bg-[#5f3412]"
          onClick={() => navigate("/admin")}
        >
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* breadcrumb */}
      <div className="mb-4 rounded-xl border border-[#EFEAE2] bg-white px-4 py-2 text-[11px] text-[#734128]/70">
        Dashboard &nbsp;›&nbsp; Edit Kost
      </div>

      {/* title */}
      <h1 className="text-[32px] font-extrabold text-[#734128]">Edit Data Kost</h1>
      <p className="mb-4 text-[12px] text-[#734128]/70">
        Perbarui data kost yang sudah ada.
      </p>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#EFEAE2] bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ================= LEFT ================= */}
          <div className="rounded-2xl border border-[#EFEAE2] bg-[#FBF4EA] p-5">
            <div className="mb-4 inline-flex rounded-lg bg-[#EFE1D3] px-3 py-1 text-[11px] font-semibold text-[#734128]">
              Mode Edit
            </div>

            {/* Nama */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Nama Kost <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128]"
              />
              {errors.name ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.name}</p>
              ) : null}
            </div>

            {/* Tipe */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Tipe Kost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-9 w-full appearance-none rounded-xl border border-[#E8DCCF] bg-white px-3 pr-10 text-[12px] text-[#734128] outline-none"
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Putra">Putra</option>
                  <option value="Putri">Putri</option>
                  <option value="Campur">Campur</option>
                  <option value="Pet Friendly">Pet Friendly</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#734128]/60">
                  ⌄
                </span>
              </div>
              {errors.type ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.type}</p>
              ) : null}
            </div>

            {/* Harga */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Harga per bulan <span className="text-red-500">*</span>
              </label>

              <div className="flex h-9 overflow-hidden rounded-xl border border-[#E8DCCF] bg-white">
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="numeric"
                  placeholder="1500000"
                  className="h-9 w-full border-0 px-3 text-[12px] text-[#734128] shadow-none focus-visible:ring-0"
                />
                <div className="flex w-14 items-center justify-center bg-[#F6EFE6] text-[12px] font-bold text-[#734128]">
                  Rp
                </div>
              </div>

              {errors.price ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.price}</p>
              ) : (
                <p className="mt-1 text-[11px] text-[#734128]/70">
                  Preview: Rp. {formatRupiah(price)}
                </p>
              )}
            </div>

            {/* Alamat */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#E8DCCF] bg-white px-3 py-2 text-[12px] text-[#734128] outline-none"
                placeholder="Jl. Mawar No. 10 Yogyakarta"
              />
              {errors.address ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.address}</p>
              ) : null}
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-[12px] font-bold text-[#734128]">
                Status
              </label>
              <div className="flex items-center gap-8 text-[12px] text-[#734128]">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Tersedia"}
                    onChange={() => setStatus("Tersedia")}
                  />
                  Tersedia
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Tidak Tersedia"}
                    onChange={() => setStatus("Tidak Tersedia")}
                  />
                  Tidak Tersedia
                </label>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="rounded-2xl border border-[#EFEAE2] bg-white p-5">
            {/* Foto URL */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Foto (URL Gambar) <span className="text-red-500">*</span>
              </label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128]"
                placeholder="https://example.com/kost.jpg"
              />
              {errors.image ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.image}</p>
              ) : null}
            </div>

            {/* Preview */}
            <div className="mb-5">
              <p className="mb-2 text-[12px] font-bold text-[#734128]">Preview Gambar</p>
              <div className="flex justify-center">
                <div className="h-[120px] w-[250px] overflow-hidden rounded-2xl bg-[#F6EFE6] shadow-sm">
                  {image ? (
                    <img
                      src={image}
                      alt={`Preview ${name || "kost"}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Fasilitas */}
            <div className="mb-4">
              <label className="mb-2 block text-[12px] font-bold text-[#734128]">
                Fasilitas
              </label>

              <div className="flex flex-wrap gap-2">
                {facilities.map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => removeFacility(f)}
                    className="rounded-lg bg-[#EFE1D3] px-3 py-1 text-[11px] font-semibold text-[#734128] hover:bg-[#e6d6c7]"
                    title="Klik untuk hapus"
                  >
                    {f}
                  </button>
                ))}

                <Input
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyDown={handleFacilityKeyDown}
                  placeholder="Tambah fasilitas..."
                  className="h-9 w-[200px] rounded-xl border-[#E8DCCF] text-[12px] text-[#734128]"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#734128]/70">
                Pisahkan dengan koma atau tekan Enter
              </p>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="mb-1 block text-[12px] font-bold text-[#734128]">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#E8DCCF] bg-white px-3 py-2 text-[12px] text-[#734128] outline-none"
                placeholder="Deskripsi kost..."
              />
              {errors.description ? (
                <p className="mt-1 text-[11px] text-[#734128]/80">{errors.description}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            className="h-9 rounded-xl !bg-[#EFE1D3] px-6 text-[12px] font-semibold !text-[#734128] hover:!bg-[#e6d6c7]"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={!isValid}
            className="h-9 rounded-xl !bg-[#734128] px-6 text-[12px] font-semibold !text-white hover:!bg-[#5f3412] disabled:opacity-60"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
