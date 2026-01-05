import { useMemo, useState } from "react";
import { Link } from "react-router-dom";


import DataTable from "../../components/admin/DataTable";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


export default function Dashboard({ kosts = [], onDelete = () => {} }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Semua Tipe");


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kosts.filter((k) => {
      const okQ =
        !q ||
        (k.name ?? "").toLowerCase().includes(q) ||
        (k.address ?? "").toLowerCase().includes(q);
      const okT = type === "Semua Tipe" ? true : (k.type ?? "") === type;
      return okQ && okT;
    });
  }, [kosts, query, type]);


  const total = filtered.length;
  const tersedia = filtered.filter(
    (k) => (k.status ?? "Tersedia") === "Tersedia"
  ).length;
  const tidakTersedia = filtered.filter(
    (k) => (k.status ?? "Tersedia") === "Tidak Tersedia"
  ).length;


  return (
    <div className="space-y-5">
      {/* TITLE + ADD */}
      <div className="flex items-start justify-between">
        <h1 className="text-[34px] font-extrabold leading-tight text-[#734128]">
          Manajemen
          <br />
          Data Kost
        </h1>


        <Button
          asChild
          className="rounded-xl bg-[#F2D8AF] px-4 text-xs font-semibold text-[#734128] hover:bg-[#e6c89b]"
        >
          <Link to="/admin/add">+ Tambah Kost</Link>
        </Button>
      </div>


      <div className="rounded-2xl bg-[#F7F3EE] p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
 
          <div className="relative w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#734128]/60">
              🔍
            </span>
            <Input
              className="h-9 rounded-xl bg-white pl-9 text-xs font-light text-[#734128] shadow-sm placeholder:text-[#734128]/40"
              placeholder="Cari Kost..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>


          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-9 rounded-xl bg-white px-4 text-[13px] font-bold text-[#734128] shadow-sm outline-none"
          >
            <option>Semua Tipe</option>
            <option>Putra</option>
            <option>Putri</option>
            <option>Campur</option>
            <option>Pet Friendly</option>
          </select>


          <div className="ml-auto overflow-hidden rounded-xl border border-[#E8DCCF] bg-white shadow-sm">
            <div className="grid grid-cols-3">
              <div className="px-5 py-2 text-center">
                <p className="text-[11px] font-bold text-[#734128]">
                  Total kost: {total}
                </p>
              </div>


              <div className="border-l border-[#E8DCCF] px-5 py-2 text-center">
                <p className="text-[11px] font-bold text-[#734128]">
                  Tersedia: {tersedia}
                </p>
              </div>


              <div className="border-l border-[#E8DCCF] px-5 py-2 text-center">
                <p className="text-[11px] font-bold text-[#734128]">
                  Tidak Tersedia: {tidakTersedia}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="rounded-2xl bg-[#F7F3EE] p-4">
        <DataTable rows={filtered} onDelete={onDelete} />
      </div>
    </div>
  );
}



