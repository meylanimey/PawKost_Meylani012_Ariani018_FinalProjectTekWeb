import { useEffect, useMemo, useState } from "react";
import KostCarouselRow from "@/components/public/KostCarouselRow";
import { KOSTS_ENDPOINT } from "@/api/mockapi";

export default function KostSection({
  id,
  title,
  subtitle,

  items = [],

  renderItem,
  showFilter = false,
  filterValue = "Semua",
  onFilterChange,
  className = "",

  onlyPublished = true,
}) {
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
          throw new Error(`Gagal ambil data kost (${res.status}) ${text}`);
        }
        const data = await res.json();
        if (!alive) return;
        setApiItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Gagal memuat data kost");
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

    if (!showFilter || !filterValue || filterValue === "Semua") {
      return publishedFiltered;
    }
    return publishedFiltered.filter((k) => String(k.jenis) === filterValue);
  }, [items, apiItems, showFilter, filterValue, onlyPublished]);

  const filterOptions = useMemo(() => {
    if (!showFilter) return [];
    const set = new Set(
      finalItems.map((k) => String(k.jenis || "")).filter(Boolean)
    );
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b, "id-ID"));

    if (arr.length === 0) {
      return ["Campur", "Putra", "Putri", "Pet Friendly"];
    }
    return arr;
  }, [finalItems, showFilter]);

  return (
    <section id={id} className={`w-full scroll-mt-24 ${className}`}>
      <div
        className={[
          "flex items-start justify-between gap-4 mb-3",
          "transition-all duration-500 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        <div>
          <h2 className="text-2xl font-extrabold text-[#6B4423]">{title}</h2>

          {subtitle && (
            <p className="text-sm text-[#C07A2D] italic mt-1">{subtitle}</p>
          )}

          {(loading || err) && (
            <div className="mt-1 text-xs">
              {loading && (
                <span className="text-[#8B6F47]">Memuat data...</span>
              )}
              {!!err && <span className="text-red-600">{err}</span>}
            </div>
          )}
        </div>

        {showFilter && (
          <div className="shrink-0">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange?.(e.target.value)}
              className="
                px-3 py-2 rounded-md
                bg-[#FFF8ED] text-[#6B4423] font-semibold
                border border-[#E6D5BC] shadow-sm
                outline-none
                transition-all duration-200
                hover:shadow-md
              "
              aria-label="Filter jenis kost"
            >
              <option value="Semua">Semua</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "Putra"
                    ? "Kost Putra"
                    : opt === "Putri"
                    ? "Kost Putri"
                    : opt === "Pet Friendly"
                    ? "Kost Pet Friendly"
                    : opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <KostCarouselRow
        items={finalItems}
        renderItem={renderItem}
        scrollStep={360}
      />
    </section>
  );
}