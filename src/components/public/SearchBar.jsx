import { useEffect, useMemo, useRef, useState } from "react";
import { KOSTS_ENDPOINT } from "@/api/mockapi";

const PRICE_OPTIONS = [
  "> Rp 250.000 – Rp 500.000",
  "> Rp 500.000 – Rp 1.000.000",
  "> Rp 1.000.000 – Rp 2.000.000",
  "> Rp 2.000.000 – Rp 3.000.000",
  "> Rp 3.000.000 – Rp 5.000.000",
  "> Rp 5.000.000",
];

const OPT_CACHE_KEY = "kost_search_filter_options_v1";
const OPT_CACHE_TTL_MS = 10 * 60 * 1000;

const safeStr = (v) => String(v ?? "").trim();
const uniqSortId = (arr) =>
  Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "id-ID")
  );

const isPublishedKost = (k) => !!(k?.isPublished ?? true);
const getTipe = (k) => safeStr(k?.jenis ?? k?.type ?? "");
const getDaerah = (k) => safeStr(k?.daerah ?? "");
const getKampus = (k) => safeStr(k?.kampus ?? "");

function readCachedOptions() {
  try {
    const raw = sessionStorage.getItem(OPT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || Date.now() - parsed.ts > OPT_CACHE_TTL_MS) return null;
    if (
      !parsed?.typeOptions ||
      !parsed?.regionOptions ||
      !parsed?.campusOptions
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedOptions(payload) {
  try {
    sessionStorage.setItem(
      OPT_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), ...payload })
    );
  } catch {}
}

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Masukkan nama kost/jenis kost/lokasi/harga",
}) {
  const [open, setOpen] = useState(false);

  const [types, setTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);

  const [typeOptions, setTypeOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [campusOptions, setCampusOptions] = useState([]);
  const [loadingOpt, setLoadingOpt] = useState(true);
  const [optErr, setOptErr] = useState("");

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const cached = readCachedOptions();
    if (cached) {
      setTypeOptions(
        Array.isArray(cached.typeOptions) ? cached.typeOptions : []
      );
      setRegionOptions(
        Array.isArray(cached.regionOptions) ? cached.regionOptions : []
      );
      setCampusOptions(
        Array.isArray(cached.campusOptions) ? cached.campusOptions : []
      );
      setLoadingOpt(false);
      setOptErr("");

      return;
    }

    const ctrl = new AbortController();

    async function loadOptions() {
      setLoadingOpt(true);
      setOptErr("");

      try {
        const res = await fetch(KOSTS_ENDPOINT, { signal: ctrl.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil opsi filter (${res.status}) ${text}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const publishedList = list.filter(isPublishedKost);

        const typesArr = [];
        const regionsArr = [];
        const campusesArr = [];

        for (const k of publishedList) {
          const t = getTipe(k);
          const r = getDaerah(k);
          const c = getKampus(k);
          if (t) typesArr.push(t);
          if (r) regionsArr.push(r);
          if (c) campusesArr.push(c);
        }

        const payload = {
          typeOptions: uniqSortId(typesArr),
          regionOptions: uniqSortId(regionsArr),
          campusOptions: uniqSortId(campusesArr),
        };

        setTypeOptions(payload.typeOptions);
        setRegionOptions(payload.regionOptions);
        setCampusOptions(payload.campusOptions);

        writeCachedOptions(payload);
      } catch (e) {
        if (e?.name === "AbortError") return;

        setOptErr(e?.message || "Gagal ambil opsi filter");

        setTypeOptions(["Campur", "Putra", "Putri", "Pet Friendly"]);
        setRegionOptions([
          "Yogyakarta",
          "Semarang",
          "Pontianak",
          "Bandung",
          "Kotawaringin Barat",
          "Bali",
          "Jakarta",
          "Medan",
        ]);
        setCampusOptions([
          "UAD",
          "UGM",
          "UNY",
          "UI",
          "ITB",
          "UPR",
          "UMY",
          "UNTAN",
          "UNAIR",
          "UNDIP",
          "UNPAD",
          "TELKOM",
        ]);
      } finally {
        setLoadingOpt(false);
      }
    }

    loadOptions();
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    setTypes((prev) => prev.filter((x) => typeOptions.includes(x)));
  }, [typeOptions]);

  useEffect(() => {
    setRegions((prev) => prev.filter((x) => regionOptions.includes(x)));
  }, [regionOptions]);

  useEffect(() => {
    setCampuses((prev) => prev.filter((x) => campusOptions.includes(x)));
  }, [campusOptions]);

  const activeCount = useMemo(() => {
    return types.length + regions.length + campuses.length + priceRanges.length;
  }, [types, regions, campuses, priceRanges]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      query: value,
      types,
      regions,
      campuses,
      priceRanges,
    });
    setOpen(false);
  };

  const resetAll = () => {
    setTypes([]);
    setRegions([]);
    setCampuses([]);
    setPriceRanges([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className="w-full flex items-center gap-2
                     bg-white rounded-xl border border-[#E6D5BC]
                     shadow-sm px-3 py-2"
        >
          <span className="text-[#9C7A4F]">
            <SearchIcon className="w-5 h-5" />
          </span>

          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none
                       text-sm md:text-base text-[#6B4423]
                       placeholder:text-[#B59A74]"
          />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative shrink-0 rounded-lg
                       border border-[#E6D5BC] bg-[#EFE6DA]
                       px-2.5 py-2 text-[#6B4423]
                       hover:bg-[#E6D5BC] transition"
            aria-label="Buka filter"
          >
            <SlidersIcon className="w-5 h-5" />
            {activeCount > 0 && (
              <span
                className="absolute -top-2 -right-2 min-w-5 h-5
                           rounded-full bg-[#6B4423] text-white
                           text-xs font-bold grid place-items-center px-1"
              >
                {activeCount}
              </span>
            )}
          </button>

          <button
            type="submit"
            className="shrink-0 rounded-lg px-4 py-2
                       bg-[#EFE6DA] text-[#6B4423] font-semibold
                       border border-[#E6D5BC]
                       hover:bg-[#E6D5BC] transition"
          >
            Cari
          </button>
        </div>
      </form>

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 z-50
                     rounded-xl border border-[#E6D5BC]
                     bg-white shadow-lg p-4"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="text-xs text-[#8B6F47]">
              {loadingOpt ? "Memuat opsi filter..." : "Opsi filter siap"}
              {!loadingOpt && (
                <span className="ml-2 text-[11px] text-[#B59A74]">
                  (opsi dari kost published)
                </span>
              )}
            </div>

            {!!optErr && (
              <div className="text-xs text-red-600 whitespace-pre-line text-right">
                {optErr}
              </div>
            )}
          </div>

          <FilterSection
            title="Jenis Kost"
            options={typeOptions}
            selected={types}
            setSelected={setTypes}
          />
          <FilterSection
            title="Daerah"
            options={regionOptions}
            selected={regions}
            setSelected={setRegions}
          />
          <FilterSection
            title="Area Kampus"
            options={campusOptions}
            selected={campuses}
            setSelected={setCampuses}
          />
          <FilterSection
            title="Rentang Harga"
            options={PRICE_OPTIONS}
            selected={priceRanges}
            setSelected={setPriceRanges}
          />

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="text-sm font-semibold text-[#9C7A4F] hover:text-[#6B4423] transition"
            >
              Reset Filter
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2
                         bg-[#EFE6DA] text-[#6B4423] font-semibold
                         border border-[#E6D5BC]
                         hover:bg-[#E6D5BC] transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, options, selected, setSelected }) {
  const safeOptions = Array.isArray(options) ? options : [];

  const toggle = (opt) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-bold text-[#6B4423]">{title}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {safeOptions.length === 0 ? (
          <div className="text-xs text-[#8B6F47]">
            Belum ada opsi untuk {title.toLowerCase()}.
          </div>
        ) : (
          safeOptions.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                  active
                    ? "bg-[#E6D5BC] text-[#6B4423] border-[#D8C2A0]"
                    : "bg-white text-[#8B6F47] border-[#E6D5BC] hover:bg-[#FFF8ED]",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlidersIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7v0M15 12v0M11 17v0"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}