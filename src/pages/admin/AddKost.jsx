import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";


function formatRupiah(n) {
  const num = Number(n || 0);
  return new Intl.NumberFormat("id-ID").format(num);
}


const DEFAULT_FACILITIES = ["WiFi", "Kamar Mandi Dalam", "Parkir"];


export default function AddKost({ onAdd = () => {} }) {
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");


  const [facilities, setFacilities] = useState(DEFAULT_FACILITIES);
  const [facilityInput, setFacilityInput] = useState("");


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


    const exists = facilities.some((f) => f.toLowerCase() === val.toLowerCase());
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
    if (!isValid) return;


    const newKost = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      price: Number(price),
      address: address.trim(),
      description: description.trim(),
      image: image.trim(),
      facilities,
      status: "Tersedia",
    };


    onAdd(newKost);
    navigate("/admin");
  };


  return (
    <div className="w-full">
      <div className="mb-4 rounded-xl border border-[#EFEAE2] bg-white px-4 py-2 text-[11px] text-[#734128]/70">
        Dashboard &nbsp;›&nbsp; Tambah Kost
      </div>




      <h1 className="mb-4 text-[32px] font-extrabold text-[#734128]">
        Tambah Data Kost Baru
      </h1>


      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#EFEAE2] bg-white p-6 shadow-sm"
      >
        <div className="mb-5">
          <label className="mb-1 block text-[12px] font-bold text-[#734128]">
            Nama Kost <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Kost"
            className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128] placeholder:text-[#734128]/35"
          />
          {errors.name ? (
            <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
              <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                i
              </span>
              {errors.name}
            </p>
          ) : null}
        </div>


        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
       
          <div>
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
              </select>


              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#734128]/60">
                ⌄
              </span>
            </div>


            {errors.type ? (
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
                <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                  i
                </span>
                {errors.type}
              </p>
            ) : null}
          </div>


          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#734128]">
              Harga / Bulan <span className="text-red-500">*</span>
            </label>


            <div className="flex h-9 overflow-hidden rounded-xl border border-[#E8DCCF] bg-white">
              <div className="flex w-14 items-center justify-center bg-[#F6EFE6] text-[12px] font-bold text-[#734128]">
                Rp
              </div>


              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="numeric"
                placeholder=" "
                className="h-9 w-full border-0 px-3 text-[12px] text-[#734128] shadow-none focus-visible:ring-0"
              />
            </div>


            {errors.price ? (
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
                <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                  i
                </span>
                {errors.price}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-[#734128]/70">
                Preview: Rp. {formatRupiah(price)}/bulan
              </p>
            )}
          </div>
        </div>


        <div className="mb-5">
          <label className="mb-2 block text-[12px] font-bold text-[#734128]">
            Fasilitas <span className="text-red-500">*</span>
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


            <div className="min-w-[220px] flex-1">
              <Input
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyDown={handleFacilityKeyDown}
                placeholder="Isi disini ..."
                className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128] placeholder:text-[#734128]/35"
              />
              <p className="mt-1 text-[11px] text-[#734128]/70">
                Pisahkan dengan koma atau tekan Enter
              </p>
            </div>
          </div>
        </div>


        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#734128]">
              Alamat <span className="text-red-500">*</span>
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Ki Ageng Pemanahan ..."
              className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128] placeholder:text-[#734128]/35"
            />
            {errors.address ? (
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
                <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                  i
                </span>
                {errors.address}
              </p>
            ) : null}
          </div>


          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#734128]">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat kost..."
              className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128] placeholder:text-[#734128]/35"
            />
            {errors.description ? (
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
                <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                  i
                </span>
                {errors.description}
              </p>
            ) : null}
          </div>
        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
     
          <div>
            <label className="mb-1 block text-[12px] font-bold text-[#734128]">
              URL Gambar <span className="text-red-500">*</span>
            </label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="h-9 rounded-xl border-[#E8DCCF] text-[12px] text-[#734128] placeholder:text-[#734128]/35"
            />
            {errors.image ? (
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#734128]/80">
                <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                  i
                </span>
                {errors.image}
              </p>
            ) : null}


            <p className="mt-3 flex items-center gap-2 text-[11px] text-[#734128]/70">
              <span className="inline-block h-4 w-4 rounded-full bg-[#EFEAE2] text-center leading-4">
                i
              </span>
              Semua input wajib diisi sebelum menyimpan
            </p>
          </div>


          <div className="flex items-end justify-center md:justify-end">
            <div className="h-[90px] w-[180px] overflow-hidden rounded-2xl bg-[#F6EFE6] shadow-sm">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>


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
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}



