import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Home, TriangleAlert, ChevronDown, Plus } from "lucide-react";

export default function Dashboard({ kosts = [] }) {
  const navigate = useNavigate();

  // dropdown periode
  const [openPeriode, setOpenPeriode] = useState(false);
  const [periode, setPeriode] = useState("7 hari terakhir");
  const periodeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodeRef.current && !periodeRef.current.contains(e.target)) {
        setOpenPeriode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = kosts.length;
  const tersedia = kosts.filter(
    (k) => String(k.status || "").toLowerCase() !== "penuh"
  ).length;
  const penuh = total - tersedia;

  const periodText =
    periode === "Semua waktu"
      ? "Periode: Semua waktu"
      : periode === "30 hari terakhir"
      ? "Periode: 30 hari terakhir"
      : "Periode: 7 hari terakhir";

  const setPeriodeValue = (value) => {
    setPeriode(value);
    setOpenPeriode(false);
  };

  // ===== Helpers (anti beda key data) =====
  const getNama = (k) => k.nama ?? k.name ?? k.namaKost ?? "Nama Kost";
  const getImg = (k) => k.urlGambar ?? k.gambar ?? k.image ?? k.imageUrl ?? "";
  const getStatus = (k) => (k.status ? String(k.status) : "Tersedia");

  const parseHarga = (k) => {
    const raw = k.harga ?? k.hargaSewa ?? k.harga_sewa ?? k.price ?? 0;
    const num = Number(String(raw).replace(/[^\d]/g, "")) || 0;
    return num.toLocaleString("id-ID");
  };

  const formatDate = (iso) => {
    if (!iso) return "Tanggal tidak tersedia";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Tanggal tidak tersedia";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ ambil data terbaru: max 20 biar enak discroll
  // jika createdAt belum ada (seed), fallback ke now biar tetap ada tanggal
  const terbaru = useMemo(() => {
    const nowIso = new Date().toISOString();
    return (kosts || [])
      .map((k) => ({
        ...k,
        createdAt: k.createdAt ?? k.created_at ?? nowIso,
      }))
      .slice(0, 20);
  }, [kosts]);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-extrabold leading-none text-[#734128]">
            Dashboard
          </h1>
          <p className="mt-1 text-xl font-regular text-[#734128]">Halo Admin!</p>
        </div>

        {/* Right tools */}
        <div className="flex items-start gap-2">
          {/* Kolom periode: dropdown + textperiode di bawahnya */}
          <div className="flex flex-col items-end gap-1">
            <div ref={periodeRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenPeriode((v) => !v)}
                className="
                  h-9 px-4 rounded-lg
                  bg-[#F0E3D0] text-[#734128]
                  text-sm font-medium
                  flex items-center gap-2
                  shadow-[inset_0_0_0_1px_#B7AB92]
                  shadow-inner
                "
              >
                {periode} <ChevronDown size={18} className="text-[#734128]" />
              </button>

              <div
                className={[
                  "absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-lg z-50",
                  "border border-[#B7AB92] bg-white shadow-lg",
                  "transition-all duration-150 origin-top",
                  openPeriode
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setPeriodeValue("Semua waktu")}
                  className="
                    w-full text-left px-4 py-2
                    text-sm font-semibold text-[#734128]
                    bg-white hover:bg-gray-50 transition
                    border-b border-gray-100 last:border-b-0
                  "
                >
                  Semua waktu
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodeValue("30 hari terakhir")}
                  className="
                    w-full text-left px-4 py-2
                    text-sm font-semibold text-[#734128]
                    bg-white hover:bg-gray-50 transition
                    border-b border-gray-100 last:border-b-0
                  "
                >
                  30 hari terakhir
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodeValue("7 hari terakhir")}
                  className="
                    w-full text-left px-4 py-2
                    text-sm font-semibold text-[#734128]
                    bg-white hover:bg-gray-50 transition
                    border-b border-gray-100 last:border-b-0
                  "
                >
                  7 hari terakhir
                </button>
              </div>
            </div>

            {/* text periode tepat di bawah dropdown */}
            <div className="text-xs pr-4 text-[#8F6753]">{periodText}</div>
          </div>

          {/* Tambah kost */}
          <button
            type="button"
            onClick={() => navigate("/admin/kost/tambah")}
            className="
              h-9 px-4 rounded-lg
              bg-[#F0E3D0] text-[#734128]
              text-sm font-medium
              flex items-center gap-2
              shadow-[inset_0_0_0_1px_#B7AB92]
              shadow-inner
            "
          >
            <Plus size={18} className="text-[#734128]" /> Tambah Kost
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        className="w-full p-4 rounded-2xl"
        style={{
          backgroundColor: "#FBF4EE",
          boxShadow: "inset 0 0 0 1px #F2EFEF, 0 8px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex justify-center gap-6">
          {/* Total Kost */}
          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow:
                "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
              backdropFilter: "blur(8px)",
              padding: 18,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, backgroundColor: "#8F6C1A" }}
            >
              <Home size={30} color="#FFFFFF" />
            </div>

            <div className="leading-tight">
              <div className="text-[32px] font-semibold text-[#734128]">
                {total}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Total Kost
              </div>
            </div>
          </div>

          {/* Tersedia */}
          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow:
                "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
              backdropFilter: "blur(8px)",
              padding: 18,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, backgroundColor: "#21A10D" }}
            >
              <CheckCircle2 size={40} color="#FFFFFF" />
            </div>

            <div className="leading-tight">
              <div className="text-[32px] font-semibold text-[#734128]">
                {tersedia}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Tersedia
              </div>
            </div>
          </div>

          {/* Penuh */}
          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow:
                "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
              backdropFilter: "blur(8px)",
              padding: 18,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, backgroundColor: "#FF4319" }}
            >
              <TriangleAlert size={40} color="#FFFFFF" />
            </div>

            <div className="leading-tight">
              <div className="text-[32px] font-semibold text-[#734128]">
                {penuh}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Penuh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel bawah */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-[#E5D5C0] bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="h-12 px-6 bg-[#EFE4D0] border-b border-[#E5D5C0] flex items-center justify-center">
            <div className="text-[20px] font-bold text-[#734128]">
              Kost Terbaru Ditambahkan
            </div>
          </div>

          {/* ✅ LIST SCROLL SAJA */}
          <div className="px-6 py-5 space-y-4 max-h-[300px] overflow-y-auto">
            {terbaru.length === 0 ? (
              <div className="text-center text-sm text-[#8F6753]">
                Belum ada kost yang ditambahkan
              </div>
            ) : (
              terbaru.map((kost) => {
                const status = getStatus(kost);
                const isPenuh = status.toLowerCase() === "penuh";
                const img = getImg(kost);

                return (
                  <div
                    key={kost.id ?? `${getNama(kost)}-${kost.createdAt}`}
                    className="grid items-center gap-4"
                    style={{ gridTemplateColumns: "160px 1fr 140px" }}
                  >
                    {/* Image */}
                    <div className="h-20 w-40 rounded-2xl overflow-hidden border border-[#E5D5C0] bg-gray-100">
                      <img
                        alt={getNama(kost)}
                        src={img ? img : "https://picsum.photos/seed/pawkost/240/160"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#734128] leading-tight truncate">
                        {getNama(kost)}
                      </div>
                      <div className="text-[14px] font-semibold text-[#734128]">
                        Rp. {parseHarga(kost)} / bulan
                      </div>
                      <div className="mt-1 text-[12px] text-[#8F6753]">
                        Ditambahkan: {formatDate(kost.createdAt)}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-end">
                      <span
                        className={[
                          "inline-flex justify-center px-4 py-2 rounded-full text-white text-[13px] font-semibold",
                          isPenuh ? "bg-[#FF4319]" : "bg-[#6B8F3A]",
                        ].join(" ")}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ✅ FOOTER TIDAK IKUT SCROLL */}
          <div className="px-6 pb-4 pt-2 flex justify-end border-t border-[#E5D5C0] bg-white">
            <button
              type="button"
              onClick={() => navigate("/admin/kost")}
              className="
                px-6 py-2 rounded-xl
                bg-[#F0E3D0] text-[#734128]
                text-[13px] font-semibold
                shadow-[inset_0_0_0_1px_#B7AB92]
                shadow-inner
                hover:bg-[#ead9c4]
                transition
              "
            >
              Kelola kost →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
