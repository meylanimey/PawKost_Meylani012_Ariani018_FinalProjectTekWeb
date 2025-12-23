// src/pages/public/Home.jsx
import { useMemo, useState } from "react";
import Navbar from "../../components/public/Navbar";
import KostCard from "../../components/public/KostCard";
import Footer from "../../components/public/Footer";
import KostDetail from "./KostDetail";
import { kosts } from "../../data/kosts";

export default function Home() {
  const [dataKost] = useState(kosts); // ✅ dummy data di useState (CP1)
  const [selectedKost, setSelectedKost] = useState(null);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("Semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataKost.filter((k) => {
      const matchQuery =
        !q || k.name.toLowerCase().includes(q) || k.address.toLowerCase().includes(q);
      const matchType = type === "Semua" || k.type === type;
      return matchQuery && matchType;
    });
  }, [dataKost, query, type]);

  const handleRent = (kost) => {
    console.log("Sewa dari katalog:", kost.id, kost.name); // ✅ event handling CP1
  };

  if (selectedKost) {
    return <KostDetail kost={selectedKost} onBack={() => setSelectedKost(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            ✨ Checkpoint 1 — UI statis + dummy data
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Temukan kost yang cocok,
            <span className="text-white/70"> cepat dan rapi</span>.
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Cari berdasarkan nama/alamat, filter tipe kost, lalu klik detail atau sewa.
          </p>

          {/* Search & Filter */}
          <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_180px_140px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama kost / lokasi..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            >
              <option>Semua</option>
              <option>Putra</option>
              <option>Putri</option>
              <option>Campur</option>
            </select>

            <a
              href="#katalog"
              className="grid place-items-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90 active:scale-[0.99]"
            >
              Lihat Katalog
            </a>
          </div>
        </div>
      </section>

      {/* Katalog */}
      <section id="katalog" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Katalog Kost</h2>
            <p className="mt-1 text-sm text-white/60">
              Menampilkan {filtered.length} kost
            </p>
          </div>

          <button
            className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            onClick={() => {
              setQuery("");
              setType("Semua");
              console.log("Filter direset"); // ✅ event handling CP1
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((kost) => (
            <KostCard
              key={kost.id}
              kost={kost}
              onRent={handleRent}
              onDetail={(k) => setSelectedKost(k)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
            Tidak ada kost yang cocok. Coba kata kunci lain.
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
