import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import HeroSearch from "@/components/public/HeroSearch";
import KostSection from "@/components/public/KostSection";
import KostCard from "@/components/public/KostCard";
import EmptyKost from "@/components/public/EmptyKost";
import { KOSTS_ENDPOINT } from "@/api/mockapi";

function parseRupiah(str) {
  return Number(String(str ?? "").replace(/[^\d]/g, "")) || 0;
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

function toPublicKost(k) {
  const hargaNum =
    typeof k?.harga === "number"
      ? k.harga
      : Number(String(k?.harga ?? "").replace(/[^\d]/g, "")) || 0;

  return {
    id: k?.id,
    name: k?.nama ?? k?.name ?? "",
    location: k?.lokasi ?? k?.location ?? "",
    type: k?.jenis ?? k?.type ?? "",
    price: hargaNum,
    facilities: Array.isArray(k?.fasilitas)
      ? k.fasilitas
      : Array.isArray(k?.facilities)
      ? k.facilities
      : [],
    image:
      k?.urlGambar ??
      k?.image ??
      k?.gambar ??
      "https://picsum.photos/seed/kost/240/160",
    description: k?.deskripsi ?? k?.description ?? "",
    daerah: k?.daerah ?? "",
    kampus: k?.kampus ?? "",
    status: k?.status ?? "Tersedia",
    isPublished: !!(k?.isPublished ?? false),
    createdAt: k?.createdAt ?? k?.created_at ?? null,
    updatedAt: k?.updatedAt ?? k?.updated_at ?? null,
  };
}

function matchQuery(k, q) {
  if (!q) return true;
  const text = q.toLowerCase();
  return (
    String(k.name || "")
      .toLowerCase()
      .includes(text) ||
    String(k.location || "")
      .toLowerCase()
      .includes(text) ||
    String(k.type || "")
      .toLowerCase()
      .includes(text) ||
    String(k.description || "")
      .toLowerCase()
      .includes(text) ||
    (k.facilities || []).some((f) => String(f).toLowerCase().includes(text))
  );
}

function applyFilters(kosts, filters) {
  const query = (filters?.query || "").trim();
  const types = filters?.types || [];
  const regions = filters?.regions || [];
  const campuses = filters?.campuses || [];
  const priceRanges = filters?.priceRanges || [];

  return (kosts || []).filter((k) => {
    if (!matchQuery(k, query)) return false;

    if (types.length && !types.includes(k.type)) return false;

    if (regions.length) {
      const hay = `${k.location || ""} ${k.daerah || ""}`.toLowerCase();
      const ok = regions.some((r) => hay.includes(String(r).toLowerCase()));
      if (!ok) return false;
    }

    if (campuses.length) {
      const hay = String(k.kampus || "").toLowerCase();
      const ok = campuses.some((c) => hay.includes(String(c).toLowerCase()));
      if (!ok) return false;
    }

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

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.key]);

  const [typeFilter, setTypeFilter] = useState("Semua");

  const [filters, setFilters] = useState({
    query: "",
    types: [],
    regions: [],
    campuses: [],
    priceRanges: [],
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const [kosts, setKosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadKosts() {
      setLoading(true);
      setFetchErr("");
      try {
        const res = await fetch(KOSTS_ENDPOINT, { method: "GET" });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal memuat kost (${res.status}) ${text}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const mapped = list.map(toPublicKost);

        const publishedOnly = mapped.filter((k) => k.isPublished);

        if (!alive) return;
        setKosts(publishedOnly);
      } catch (e) {
        if (!alive) return;
        setFetchErr(e?.message || "Gagal memuat data kost");
        setKosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadKosts();
    return () => {
      alive = false;
    };
  }, []);

  const mergedFilters = useMemo(() => {
    const dropdownTypes = typeFilter === "Semua" ? [] : [typeFilter];
    const types = filters.types?.length ? filters.types : dropdownTypes;
    return { ...filters, types };
  }, [filters, typeFilter]);

  const filteredAll = useMemo(() => {
    return applyFilters(kosts, mergedFilters);
  }, [kosts, mergedFilters]);

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
      <div className="bg-white">
        <HeroSearch onSearch={setFilters} />
      </div>

      <div
        className={[
          "mx-auto max-w-6xl px-4 py-8 space-y-12",
          "transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        {loading ? (
          <div className="rounded-2xl border border-[#E6D5BC] bg-[#FFF8ED] p-5 text-[#6B4423]">
            Memuat data kost...
          </div>
        ) : fetchErr ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 whitespace-pre-line">
            {fetchErr}
          </div>
        ) : showGlobalEmpty ? (
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
              items={pilihanKost.length ? pilihanKost : kosts.slice(0, 10)}
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
                rekomendasiKost.length ? rekomendasiKost : kosts.slice(0, 10)
              }
              renderItem={(kost) => <KostCard kost={kost} />}
            />

            <KostSection
              id="kost-kampus"
              title="Kost Area Kampus"
              subtitle="Kost yang berlokasi di sekitar area kampus dan mudah diakses"
              items={
                areaKampusKost.length ? areaKampusKost : kosts.slice(0, 10)
              }
              renderItem={(kost) => <KostCard kost={kost} />}
            />

            <KostSection
              id="kost-hemat"
              title="Kost Hemat"
              subtitle="Kost nyaman dengan harga yang lebih bersahabat"
              items={kostHemat.length ? kostHemat : kosts.slice(0, 10)}
              renderItem={(kost) => <KostCard kost={kost} />}
            />

            <AboutPawkost />
          </>
        )}
      </div>
    </main>
  );
}

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