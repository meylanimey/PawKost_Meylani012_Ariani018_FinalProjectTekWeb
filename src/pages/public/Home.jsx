<<<<<<< Updated upstream
import { useMemo, useState } from "react";
import KostCard from "../../components/public/KostCard";

export default function Home({ kosts = [] }) {
  const [type, setType] = useState("Semua");

  const filtered = useMemo(() => {
    if (type === "Semua") return kosts;
    return kosts.filter((k) => k.type === type);
  }, [kosts, type]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Kamar Kost</h1>
          <p className="mt-1 text-sm text-slate-600">
            Menampilkan {filtered.length} kost
          </p>
        </div>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            console.log("Filter tipe:", e.target.value);
          }}
          className="w-full sm:w-56 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
        >
          <option>Semua</option>
          <option>Putra</option>
          <option>Putri</option>
          <option>Pet Friendly</option>
          <option>Campur</option>
        </select>
=======
import { useEffect, useMemo, useState } from "react";
import HeroSearch from "@/components/public/HeroSearch";
import KostSection from "@/components/public/KostSection";
import KostCard from "@/components/public/KostCard";
import EmptyKost from "@/components/public/EmptyKost";
import { Kosts } from "@/data/Kosts";


function parseRupiah(str) {
  return Number(String(str).replace(/[^\d]/g, "")) || 0;
}


function parsePriceRange(label) {
  if (label.includes("–")) {
    const [left, right] = label.split("–").map((s) => s.trim());
    const min = parseRupiah(left);
    const max = parseRupiah(right);
    return { min, max };
  }
  if (label.includes("5.000.000")) return { min: 5000000, max: Infinity };
  return { min: 0, max: Infinity };
}


function matchQuery(k, q) {
  if (!q) return true;
  const text = q.toLowerCase();
  return (
    String(k.name || "").toLowerCase().includes(text) ||
    String(k.location || "").toLowerCase().includes(text) ||
    String(k.type || "").toLowerCase().includes(text) ||
    String(k.description || "").toLowerCase().includes(text) ||
    (k.facilities || []).some((f) => String(f).toLowerCase().includes(text))
  );
}


function applyFilters(kosts, filters) {
  const query = (filters?.query || "").trim();
  const types = filters?.types || [];
  const regions = filters?.regions || [];
  const priceRanges = filters?.priceRanges || [];


  return kosts.filter((k) => {
    // search query
    if (!matchQuery(k, query)) return false;


    // type
    if (types.length && !types.includes(k.type)) return false;


    // region -> check in location string
    if (regions.length) {
      const loc = String(k.location || "").toLowerCase();
      const ok = regions.some((r) => loc.includes(String(r).toLowerCase()));
      if (!ok) return false;
    }


    // priceRanges
    if (priceRanges.length) {
      const price = Number(k.price) || 0;
      const ok = priceRanges.some((label) => {
        const { min, max } = parsePriceRange(label);
        return price >= min && price <= max;
      });
      if (!ok) return false;
    }


    return true;
  });
}


// ===== Page =====
export default function Home() {
  // dropdown filter section "Pilihan Kost"
  const [typeFilter, setTypeFilter] = useState("Semua");


  // payload dari SearchBar
  const [filters, setFilters] = useState({
    query: "",
    types: [],
    regions: [],
    campuses: [],
    priceRanges: [],
  });


  // animasi load page
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);


  // gabungkan dropdown typeFilter dengan filters.types
  const mergedFilters = useMemo(() => {
    const dropdownTypes = typeFilter === "Semua" ? [] : [typeFilter];
    const types = filters.types?.length ? filters.types : dropdownTypes;
    return { ...filters, types };
  }, [filters, typeFilter]);


  // hasil final (semua section pakai ini sebagai base)
  const filteredAll = useMemo(() => {
    return applyFilters(Kosts, mergedFilters);
  }, [mergedFilters]);


  // ===== Section data (dibangun dari filteredAll) =====
  const pilihanKost = useMemo(() => filteredAll, [filteredAll]);


  const rekomendasiKost = useMemo(() => {
    return filteredAll.slice(0, 10);
  }, [filteredAll]);


  const areaKampusKost = useMemo(() => {
    const keywords = [
      "seturan",
      "gejayan",
      "babarsari",
      "depok",
      "pogung",
      "demangan",
    ];
    const filtered = filteredAll.filter((k) =>
      keywords.some((kw) => String(k.location).toLowerCase().includes(kw))
    );
    return filtered.length ? filtered : filteredAll.slice(0, 10);
  }, [filteredAll]);


  const kostHemat = useMemo(() => {
    const filtered = filteredAll.filter((k) => Number(k.price) <= 2000000);
    return filtered.length ? filtered : filteredAll.slice(0, 10);
  }, [filteredAll]);


  const handleReset = () => {
    setTypeFilter("Semua");
    setFilters({
      query: "",
      types: [],
      regions: [],
      campuses: [],
      priceRanges: [],
    });
  };


  // Jika user melakukan search/filter dan hasilnya kosong,
  // tampilkan EmptyState untuk seluruh section
  const isSearchingOrFiltering = useMemo(() => {
    return (
      (filters.query || "").trim().length > 0 ||
      (filters.types?.length || 0) > 0 ||
      (filters.regions?.length || 0) > 0 ||
      (filters.campuses?.length || 0) > 0 ||
      (filters.priceRanges?.length || 0) > 0 ||
      typeFilter !== "Semua"
    );
  }, [filters, typeFilter]);


  const showGlobalEmpty = isSearchingOrFiltering && filteredAll.length === 0;


  return (
    <main className="min-h-screen bg-white">
      {/* Hero Search */}
      <div className="bg-white">
        <HeroSearch onSearch={setFilters} />
>>>>>>> Stashed changes
      </div>


      {/* Content */}
      <div
        className={[
          "mx-auto max-w-6xl px-4 py-8 space-y-12",
          "transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {showGlobalEmpty ? (
          <EmptyKost
            title="Kost yang kamu cari tidak ada 😿"
            description="Coba ganti kata kunci, kurangi filter, atau tekan Reset untuk melihat semua kost."
            onReset={handleReset}
          />
        ) : (
          <>
            <KostSection
              id="pilihan-kost"
              title="Pilihan Kost"
              subtitle="Kumpulan kost yang tersedia untuk kamu jelajahi"
              items={pilihanKost.length ? pilihanKost : Kosts.slice(0, 10)}
              showFilter
              filterValue={typeFilter}
              onFilterChange={setTypeFilter}
              renderItem={(kost) => <KostCard kost={kost} />}
            />


            <KostSection
              id="rekomendasi-kost"
              title="Rekomendasi Kost"
              subtitle="Kost favorit dengan lingkungan nyaman dan fasilitas memadai"
              items={
                rekomendasiKost.length ? rekomendasiKost : Kosts.slice(0, 10)
              }
              renderItem={(kost) => <KostCard kost={kost} />}
            />


            <KostSection
              id="kost-kampus"
              title="Kost Area Kampus"
              subtitle="Kost yang berlokasi di sekitar area kampus dan mudah diakses"
              items={
                areaKampusKost.length ? areaKampusKost : Kosts.slice(0, 10)
              }
              renderItem={(kost) => <KostCard kost={kost} />}
            />


            <KostSection
              id="kost-hemat"
              title="Kost Hemat"
              subtitle="Kost nyaman dengan harga yang lebih bersahabat"
              items={kostHemat.length ? kostHemat : Kosts.slice(0, 10)}
              renderItem={(kost) => <KostCard kost={kost} />}
            />


            {/* ===== Tentang PAWKOST (baru) ===== */}
            <AboutPawkost />
          </>
        )}
      </div>
    </main>
  );
}
<<<<<<< Updated upstream
=======


/**
 * Section "Tentang PAWKOST" (di bawah section kost)
 * - gaya mengikuti contoh gambar (judul + paragraf + bullet)
 * - ada animasi halus saat muncul & hover shadow
 */
function AboutPawkost() {
  const [show, setShow] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);


  return (
    <section
      id="tentang-pawkost"
      className={[
        "rounded-3xl border border-[#E6D5BC] bg-white shadow-sm",
        "p-7 md:p-9",
        "transition-all duration-700 ease-out",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        "hover:shadow-md",
      ].join(" ")}
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-[#6B4423]">
        Tentang PAWKOST
      </h2>


      <p className="mt-3 text-[#8B6F47] leading-relaxed">
        Platform pencarian kost yang membantu kamu menemukan tempat tinggal yang
        nyaman sesuai kebutuhan. Melalui tampilan yang sederhana dan fitur
        pencarian yang praktis, PAWKOST memudahkan kamu memilih kost berdasarkan
        lokasi, fasilitas, dan harga. PAWKOST dirancang untuk memberikan
        pengalaman mencari kost yang lebih cepat dan menyenangkan.
      </p>


      <h3 className="mt-7 text-lg font-semibold text-[#6B4423]">
        Kenapa PAWKOST?
      </h3>


      <ul className="mt-3 space-y-2 text-[#8B6F47]">
        <li className="flex gap-2">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C07A2D]" />
          <span>Informasi kost tersaji secara jelas dan terstruktur</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C07A2D]" />
          <span>Pencarian kost lebih cepat dan praktis</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C07A2D]" />
          <span>Tampilan simpel dan ramah pengguna</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C07A2D]" />
          <span>Terus dikembangkan sesuai kebutuhan pengguna</span>
        </li>
      </ul>
    </section>
  );
}
>>>>>>> Stashed changes
