import { useEffect, useState } from "react";
import KostCarouselRow from "@/components/public/KostCarouselRow";

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
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

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
              <option value="Campur">Campur</option>
              <option value="Putra">Kost Putra</option>
              <option value="Putri">Kost Putri</option>
              <option value="Pet Friendly">Kost Pet Friendly</option>
            </select>
          </div>
        )}
      </div>

      <KostCarouselRow items={items} renderItem={renderItem} scrollStep={360} />
    </section>
  );
}