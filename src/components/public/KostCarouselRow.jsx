import { useEffect, useMemo, useRef, useState } from "react";
import { KOSTS_ENDPOINT } from "@/api/mockapi";

export default function KostCarouselRow({
  items = [],

  renderItem,
  scrollStep = 360,
  className = "",

  onlyPublished = true,

  limit = 20,
}) {
  const rowRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (Array.isArray(items) && items.length > 0) return;

      setLoading(true);
      setErr("");
      try {
        const res = await fetch(KOSTS_ENDPOINT);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil data (${res.status}) ${text}`);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!alive) return;
        setApiItems(list);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Gagal memuat data");
        setApiItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [items]);

  const finalItems = useMemo(() => {
    const source = Array.isArray(items) && items.length > 0 ? items : apiItems;

    const normalized = source.map((k) => ({
      ...k,
      id: k?.id,
      nama: k?.nama ?? k?.name ?? "",
      urlGambar: k?.urlGambar ?? k?.gambar ?? k?.image ?? "",
      jenis: k?.jenis ?? k?.type ?? "",
      lokasi: k?.lokasi ?? k?.location ?? "",
      daerah: k?.daerah ?? "",
      kampus: k?.kampus ?? "",
      fasilitas: Array.isArray(k?.fasilitas ?? k?.facilities)
        ? k?.fasilitas ?? k?.facilities
        : String(k?.fasilitas ?? k?.facilities ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      harga:
        typeof (k?.harga ?? k?.price) === "number"
          ? k?.harga ?? k?.price
          : Number(String(k?.harga ?? k?.price ?? "").replace(/[^\d]/g, "")) ||
            0,
      status: k?.status ?? "Tersedia",
      isPublished: !!(k?.isPublished ?? false),
    }));

    const publishedFiltered = onlyPublished
      ? normalized.filter((k) => k.isPublished)
      : normalized;

    return publishedFiltered.slice(0, Math.max(1, Number(limit) || 20));
  }, [items, apiItems, onlyPublished, limit]);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  const showArrows = finalItems.length > 0;

  return (
    <div className={`relative ${className}`}>
      {showArrows && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll kiri"
          className="
            absolute left-[-55px] top-1/2 -translate-y-1/2 z-10
            w-13 h-13 rounded-full
            bg-white border border-[#E6D5BC] shadow
            flex items-center justify-center leading-none
            transition-all duration-200
            hover:scale-105 hover:bg-[#FFF8ED]
            active:scale-95
          "
        >
          <ChevronLeft />
        </button>
      )}

      {(loading || err) && (
        <div className="mb-2 text-xs">
          {loading && <span className="text-[#8B6F47]">Memuat...</span>}
          {!!err && <span className="text-red-600">{err}</span>}
        </div>
      )}

      <div
        ref={rowRef}
        className={[
          "flex gap-6 overflow-x-auto scroll-smooth pb-3",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "transition-all duration-500 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {finalItems.length === 0 ? (
          <div className="text-sm text-[#8B6F47] py-4">
            Belum ada data untuk ditampilkan.
          </div>
        ) : (
          finalItems.map((item, idx) => (
            <div
              key={item?.id ?? `${idx}`}
              className="shrink-0 transition-transform duration-200 hover:-translate-y-1"
            >
              {renderItem?.(item)}
            </div>
          ))
        )}
      </div>

      {showArrows && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll kanan"
          className="
            absolute right-[-55px] top-1/2 -translate-y-1/2 z-10
            w-13 h-13 rounded-full
            bg-white border border-[#E6D5BC] shadow
            flex items-center justify-center leading-none
            transition-all duration-200
            hover:scale-105 hover:bg-[#FFF8ED]
            active:scale-95
          "
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="block w-13 h-13 text-[#6B4423]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.5 5 8.5 12l6 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="block w-13 h-13 text-[#6B4423]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 5 15.5 12l-6 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}