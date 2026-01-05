import { useMemo, useRef, useState } from "react";


export default function KostCarouselRow({
  items = [],
  renderItem,
  scrollStep = 360,
  className = "",
}) {
  const rowRef = useRef(null);
  const [mounted, setMounted] = useState(false);


  useMemo(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);


  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };


  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: scrollStep, behavior: "smooth" });
  };


  return (
    <div className={`relative ${className}`}>
      {/* LEFT ARROW */}
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


      <div
        ref={rowRef}
        className={[
          "flex gap-6 overflow-x-auto scroll-smooth pb-3",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "transition-all duration-500 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 transition-transform duration-200 hover:-translate-y-1"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>


      {/* RIGHT ARROW */}
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





