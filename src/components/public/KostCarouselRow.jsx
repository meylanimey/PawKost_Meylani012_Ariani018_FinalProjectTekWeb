// Import hook React untuk memoization, referensi DOM, dan state
import { useMemo, useRef, useState } from "react";

// Komponen carousel baris horizontal untuk daftar kost / item
export default function KostCarouselRow({
  items = [],          // Data item yang akan ditampilkan
  renderItem,          // Function untuk render tiap item
  scrollStep = 360,    // Jarak scroll setiap klik panah
  className = "",      // Class tambahan dari parent
}) {
  // Ref untuk mengakses elemen DOM container scroll
  const rowRef = useRef(null);

  // State untuk animasi muncul (fade + slide)
  const [mounted, setMounted] = useState(false);

  // Efek sekali jalan untuk trigger animasi setelah komponen render
  useMemo(() => {
    // Delay kecil agar animasi terasa halus
    const t = setTimeout(() => setMounted(true), 40);

    // Cleanup timeout saat komponen unmount
    return () => clearTimeout(t);
  }, []);

  // Fungsi scroll ke kiri
  const scrollLeft = () => {
    // Scroll container ke kiri secara smooth
    rowRef.current?.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  // Fungsi scroll ke kanan
  const scrollRight = () => {
    // Scroll container ke kanan secara smooth
    rowRef.current?.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  return (
    // Wrapper utama dengan posisi relative (buat tombol panah)
    <div className={`relative ${className}`}>
      
      {/* LEFT ARROW */}
      {/* Tombol scroll ke kiri */}
      <button
        type="button"
        onClick={scrollLeft} // Trigger scroll kiri
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
        <ChevronLeft /> {/* Icon panah kiri */}
      </button>

      {/* ROW CONTENT */}
      {/* Container horizontal scroll */}
      <div
        ref={rowRef} // Hubungkan ref ke DOM
        className={[
          "flex gap-6 overflow-x-auto scroll-smooth pb-3", // Layout horizontal & scroll
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden", // Hilangkan scrollbar
          "transition-all duration-500 ease-out", // Animasi transisi
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2", // Animasi muncul
        ].join(" ")}
      >
        {/* Loop semua item */}
        {items.map((item) => (
          <div
            key={item.id} // Key unik tiap item
            className="shrink-0 transition-transform duration-200 hover:-translate-y-1"
          >
            {/* Render item menggunakan function dari props */}
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      {/* Tombol scroll ke kanan */}
      <button
        type="button"
        onClick={scrollRight} // Trigger scroll kanan
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
        <ChevronRight /> {/* Icon panah kanan */}
      </button>
    </div>
  );
}

// Komponen icon panah kiri (SVG)
function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="block w-13 h-13 text-[#6B4423]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.5 5 8.5 12l6 7" // Bentuk panah kiri
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Komponen icon panah kanan (SVG)
function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="block w-13 h-13 text-[#6B4423]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 5 15.5 12l-6 7" // Bentuk panah kanan
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
