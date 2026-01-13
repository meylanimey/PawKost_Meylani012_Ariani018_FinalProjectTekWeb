import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  TriangleAlert,
  ChevronDown,
  Plus,
} from "lucide-react";

import { KOSTS_ENDPOINT } from "@/api/mockapi";

export default function Dashboard({ kosts: kostsFromProps = [] }) {
  const navigate = useNavigate();

  const [kosts, setKosts] = useState(kostsFromProps || []);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchKosts = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(KOSTS_ENDPOINT, { method: "GET" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal fetch kosts. (${res.status}) ${text}`);
      }
      const data = await res.json();
      setKosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Gagal fetch data kost");
      setKosts(kostsFromProps || []);
    } finally {
      setLoading(false);
    }
  }, [kostsFromProps]);

  useEffect(() => {
    fetchKosts();
  }, [fetchKosts]);

  const [openPeriode, setOpenPeriode] = useState(false);
  const [periode, setPeriode] = useState("7 hari terakhir");
  const periodeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodeRef.current && !periodeRef.current.contains(e.target)) {
        setOpenPeriode(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenPeriode(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const setPeriodeValue = (value) => {
    setPeriode(value);
    setOpenPeriode(false);
  };

  const periodText =
    periode === "Semua waktu"
      ? "Periode: Semua waktu"
      : periode === "30 hari terakhir"
      ? "Periode: 30 hari terakhir"
      : "Periode: 7 hari terakhir";

  const getNama = useCallback(
    (k) => k?.nama ?? k?.name ?? k?.namaKost ?? "Nama Kost",
    []
  );

  const getImg = useCallback(
    (k) => k?.urlGambar ?? k?.gambar ?? k?.image ?? k?.imageUrl ?? "",
    []
  );

  const getStatus = useCallback((k) => String(k?.status ?? "Tersedia"), []);

  const parseHargaNumber = useCallback((k) => {
    const raw = k?.harga ?? k?.hargaSewa ?? k?.harga_sewa ?? k?.price ?? 0;
    return Number(String(raw).replace(/[^\d]/g, "")) || 0;
  }, []);

  const formatRupiah = useCallback(
    (num) => Number(num || 0).toLocaleString("id-ID"),
    []
  );

  const parseDateMs = useCallback((isoLike) => {
    if (!isoLike) return null;
    const d = new Date(isoLike);
    const ms = d.getTime();
    return Number.isNaN(ms) ? null : ms;
  }, []);

  const formatDate = useCallback(
    (isoLike) => {
      const ms = parseDateMs(isoLike);
      if (!ms) return "Tanggal tidak tersedia";
      return new Date(ms).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    [parseDateMs]
  );

  const periodWindowMs = useMemo(() => {
    if (periode === "Semua waktu") return null;
    const days = periode === "30 hari terakhir" ? 30 : 7;
    return days * 24 * 60 * 60 * 1000;
  }, [periode]);

  const normalized = useMemo(() => {
    return (kosts || []).map((k) => {
      const createdAt =
        k?.createdAt ?? k?.created_at ?? k?.created ?? k?.tanggal ?? null;

      const createdAtMs = parseDateMs(createdAt);

      return {
        ...k,
        __createdAt: createdAt,
        __createdAtMs: createdAtMs,
      };
    });
  }, [kosts, parseDateMs]);

  const periodFiltered = useMemo(() => {
    if (!periodWindowMs) return normalized;

    const nowMs = Date.now();
    const minMs = nowMs - periodWindowMs;

    return normalized.filter((k) => {
      return k.__createdAtMs != null && k.__createdAtMs >= minMs;
    });
  }, [normalized, periodWindowMs]);

  const stats = useMemo(() => {
    return periodFiltered.reduce(
      (acc, k) => {
        acc.total += 1;
        const status = getStatus(k).toLowerCase();
        if (status === "penuh") acc.penuh += 1;
        else acc.tersedia += 1;
        return acc;
      },
      { total: 0, tersedia: 0, penuh: 0 }
    );
  }, [periodFiltered, getStatus]);

  const terbaru = useMemo(() => {
    return [...periodFiltered]
      .sort((a, b) => {
        if (a.__createdAtMs == null && b.__createdAtMs == null) return 0;
        if (a.__createdAtMs == null) return 1;
        if (b.__createdAtMs == null) return -1;
        return b.__createdAtMs - a.__createdAtMs;
      })
      .slice(0, 20);
  }, [periodFiltered]);

  const btnTool =
    "h-9 px-4 rounded-lg bg-[#F0E3D0] text-[#734128] text-sm font-medium flex items-center gap-2 " +
    "shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-extrabold leading-none text-[#734128]">
            Dashboard
          </h1>
          <p className="mt-1 text-xl font-regular text-[#734128]">
            Halo Admin!
          </p>

          <div className="mt-2 text-xs text-[#8F6753]">
            {loading ? "Memuat data dari MockAPI..." : "Data dari MockAPI siap"}
            {!!err && (
              <span className="ml-2 text-red-600 whitespace-pre-line">
                {err}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex flex-col items-end gap-1">
            <div ref={periodeRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenPeriode((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={openPeriode}
                className={btnTool}
              >
                {periode} <ChevronDown size={18} className="text-[#734128]" />
              </button>

              <div
                role="menu"
                className={[
                  "absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-lg z-50",
                  "border border-[#B7AB92] bg-white shadow-lg",
                  "transition-all duration-150 origin-top",
                  openPeriode
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none",
                ].join(" ")}
              >
                {["Semua waktu", "30 hari terakhir", "7 hari terakhir"].map(
                  (opt) => (
                    <button
                      key={opt}
                      role="menuitem"
                      type="button"
                      onClick={() => setPeriodeValue(opt)}
                      className="
                        w-full text-left px-4 py-2
                        text-sm font-semibold text-[#734128]
                        bg-white hover:bg-gray-50 transition
                        border-b border-gray-100 last:border-b-0
                      "
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="text-xs pr-4 text-[#8F6753]">{periodText}</div>
          </div>

          <button type="button" onClick={fetchKosts} className={btnTool}>
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/kost/tambah")}
            className={btnTool}
          >
            <Plus size={18} className="text-[#734128]" /> Tambah Kost
          </button>
        </div>
      </div>

      <div
        className="w-full p-4 rounded-2xl"
        style={{
          backgroundColor: "#FBF4EE",
          boxShadow: "inset 0 0 0 1px #F2EFEF, 0 8px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex justify-center gap-6">
          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow: "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
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
                {stats.total}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Total Kost
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow: "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
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
                {stats.tersedia}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Tersedia
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-4 rounded-xl"
            style={{
              width: 222,
              height: 121,
              backgroundColor: "#FFFFFF",
              boxShadow: "inset 0 0 0 1px #B7AB92, 0 6px 14px rgba(0,0,0,0.10)",
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
                {stats.penuh}
              </div>
              <div className="text-[16px] font-semibold text-[#734128]">
                Penuh
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-[#E5D5C0] bg-white shadow-sm overflow-hidden">
          <div className="h-12 px-6 bg-[#EFE4D0] border-b border-[#E5D5C0] flex items-center justify-center">
            <div className="text-[20px] font-bold text-[#734128]">
              Kost Terbaru Ditambahkan
            </div>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-sm text-[#8F6753]">
                Memuat data...
              </div>
            ) : terbaru.length === 0 ? (
              <div className="text-center text-sm text-[#8F6753]">
                Belum ada kost yang ditambahkan pada periode ini
              </div>
            ) : (
              terbaru.map((k) => {
                const status = getStatus(k);
                const isPenuh = status.toLowerCase() === "penuh";
                const img = getImg(k);
                const hargaNum = parseHargaNumber(k);

                return (
                  <div
                    key={k.id ?? `${getNama(k)}-${k.__createdAtMs ?? "nodate"}`}
                    className="grid items-center gap-4"
                    style={{ gridTemplateColumns: "160px 1fr 140px" }}
                  >
                    <div className="h-20 w-40 rounded-2xl overflow-hidden border border-[#E5D5C0] bg-gray-100">
                      <img
                        alt={getNama(k)}
                        src={
                          img || "https://picsum.photos/seed/pawkost/240/160"
                        }
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#734128] leading-tight truncate">
                        {getNama(k)}
                      </div>
                      <div className="text-[14px] font-semibold text-[#734128]">
                        Rp. {formatRupiah(hargaNum)} / bulan
                      </div>
                      <div className="mt-1 text-[12px] text-[#8F6753]">
                        Ditambahkan: {formatDate(k.__createdAt)}
                      </div>
                    </div>

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
