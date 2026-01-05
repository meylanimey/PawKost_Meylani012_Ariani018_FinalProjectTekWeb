import { useEffect, useMemo, useRef, useState } from "react";

const TYPE_OPTIONS = ["Campur", "Putra", "Putri", "Pet Friendly"];
const REGION_OPTIONS = [
  "Yogyakarta",
  "Semarang",
  "Pontianak",
  "Bandung",
  "Kotawaringin Barat",
  "Bali",
  "Jakarta",
  "Medan",
];

const CAMPUS_OPTIONS = [
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
];

/**
 * Price ranges: bebas string, nanti di filter logic kamu tinggal mapping.
 * Untuk sementara dikirim sebagai string saja (aman dan tidak error).
 */
const PRICE_OPTIONS = [
  "> Rp 250.000 – Rp 500.000",
  "> Rp 500.000 – Rp 1.000.000",
  "> Rp 1.000.000 – Rp 2.000.000",
  "> Rp 2.000.000 – Rp 3.000.000",
  "> Rp 3.000.000 – Rp 5.000.000",
  "> Rp 5.000.000",
];

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Masukkan nama kost/jenis kost/lokasi/harga",
}) {
  const [open, setOpen] = useState(false);

  // filter states (array of string)
  const [types, setTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // close jika klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // hitung jumlah filter aktif untuk badge kecil
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

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* BAR */}
        <div
          className="w-full flex items-center gap-2
                     bg-white rounded-xl border border-[#E6D5BC]
                     shadow-sm px-3 py-2"
        >
          {/* search icon */}
          <span className="text-[#9C7A4F]">
            <SearchIcon className="w-5 h-5" />
          </span>

          {/* input */}
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

          {/* filter toggle button */}
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

          {/* submit button */}
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

      {/* DROPDOWN PANEL */}
      {open && (
        <div
          className="absolute left-0 right-0 mt-2 z-50
                     rounded-xl border border-[#E6D5BC]
                     bg-white shadow-lg p-4"
        >
          <FilterSection
            title="Jenis Kost"
            options={TYPE_OPTIONS}
            selected={types}
            setSelected={setTypes}
          />

          <FilterSection
            title="Daerah"
            options={REGION_OPTIONS}
            selected={regions}
            setSelected={setRegions}
          />

          <FilterSection
            title="Area Kampus"
            options={CAMPUS_OPTIONS}
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
              onClick={() => {
                setTypes([]);
                setRegions([]);
                setCampuses([]);
                setPriceRanges([]);
              }}
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
  const toggle = (opt) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-bold text-[#6B4423]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
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
        })}
      </div>
    </div>
  );
}

/* Icons */
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