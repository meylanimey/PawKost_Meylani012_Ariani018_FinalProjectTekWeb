import { useMemo, useState } from "react";
import KostCard from "../../components/public/KostCard";
import { kosts } from "../../data/kosts";

export default function Home() {
  const [dataKost] = useState(kosts);
  const [type, setType] = useState("Semua");

  const filtered = useMemo(() => {
    if (type === "Semua") return dataKost;
    return dataKost.filter((k) => k.type === type);
  }, [dataKost, type]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Kamar Kost</h1>
          <p className="mt-1 text-sm text-slate-600">
            Menampilkan {filtered.length} kost
          </p>
        </div>

        {/* Filter tipe kost (tanpa reset) */}
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
        </select>
      </div>

      <section id="katalog">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((kost) => (
            <KostCard key={kost.id} kost={kost} />
          ))}
        </div>
      </section>
    </main>
  );
}