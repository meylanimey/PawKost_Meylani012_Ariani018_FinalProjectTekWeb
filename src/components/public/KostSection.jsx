// Import hook React untuk efek samping dan state
import { useEffect, useState } from "react";

// Import komponen carousel baris kost
import KostCarouselRow from "@/components/public/KostCarouselRow";

// Komponen section untuk menampilkan satu kategori kost
export default function KostSection({
  id,                 // ID section (buat anchor / scroll)
  title,              // Judul section
  subtitle,           // Subjudul (opsional)
  items = [],         // Data kost yang akan ditampilkan
  renderItem,         // Function render item kost
  showFilter = false, // Menentukan apakah filter ditampilkan
  filterValue = "Semua", // Nilai filter aktif
  onFilterChange,     // Callback saat filter berubah
  className = "",     // Class tambahan dari parent
}) {
  // State untuk animasi muncul section
  const [mounted, setMounted] = useState(false);

  // Efek untuk trigger animasi setelah komponen dirender
  useEffect(() => {
    // Delay kecil supaya animasi halus
    const t = setTimeout(() => setMounted(true), 40);

    // Cleanup timeout saat unmount
    return () => clearTimeout(t);
  }, []);

  return (
    // Section utama dengan offset scroll (buat navbar sticky)
    <section id={id} className={`w-full scroll-mt-24 ${className}`}>
      
      {/* HEADER SECTION */}
      {/* Judul, subtitle, dan filter */}
      <div
        className={[
          "flex items-start justify-between gap-4 mb-3", // Layout header
          "transition-all duration-500 ease-out",        // Animasi
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {/* Title & Subtitle */}
        <div>
          {/* Judul section */}
          <h2 className="text-2xl font-extrabold text-[#6B4423]">{title}</h2>

          {/* Subtitle hanya muncul jika ada isinya */}
          {subtitle && (
            <p className="text-sm text-[#C07A2D] italic mt-1">{subtitle}</p>
          )}
        </div>

        {/* FILTER */}
        {/* Dropdown filter hanya muncul jika showFilter true */}
        {showFilter && (
          <div className="shrink-0">
            <select
              value={filterValue} // Nilai filter saat ini
              onChange={(e) => onFilterChange?.(e.target.value)} // Kirim value ke parent
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
              {/* Opsi filter */}
              <option value="Semua">Semua</option>
              <option value="Campur">Campur</option>
              <option value="Putra">Kost Putra</option>
              <option value="Putri">Kost Putri</option>
              <option value="Pet Friendly">Kost Pet Friendly</option>
            </select>
          </div>
        )}
      </div>

      {/* CAROUSEL */}
      {/* Menampilkan daftar kost dalam bentuk carousel */}
      <KostCarouselRow
        items={items}           // Data kost
        renderItem={renderItem} // Cara render tiap item
        scrollStep={360}        // Jarak scroll per klik
      />
    </section>
  );
}
