// Import hook useState untuk menyimpan state lokal
import { useState } from "react";

// Import komponen SearchBar
import SearchBar from "@/components/public/SearchBar";

// Komponen HeroSearch menerima props onSearch dari parent
export default function HeroSearch({ onSearch }) {
  // State untuk menyimpan keyword pencarian
  const [query, setQuery] = useState("");

  return (
    // Section utama hero search
    <section className="w-full">
      {/* Container agar konten berada di tengah dan rapi */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        
        {/* Judul dan ilustrasi */}
        <div className="flex justify-center items-center gap-3">
          {/* Judul utama */}
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-[#6B4423]">
            Maw Cari Kost Apa?
          </h1>

          {/* Gambar ilustrasi */}
          <div>
            {
              <img
                src="/images/cat.png" // Path gambar kucing
                alt="cat" // Alt text untuk aksesibilitas
                className="w-24 md:w-24 -mb-6"
              />
            }
          </div>
        </div>

        {/* Area search bar */}
        <div className="mt-3">
          <SearchBar
            value={query} // Nilai input search diambil dari state query
            onChange={setQuery} // Update state query saat input berubah
            onSubmit={(payload) => {
              // payload berisi hasil pencarian lengkap
              // payload = { query, types, regions, campuses, priceRanges }

              // Memanggil fungsi onSearch dari parent jika tersedia
              onSearch?.(payload);
            }}
          />
        </div>
      </div>
    </section>
  );
}
