import React, { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";


import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


export default function DaftarUser() {
  // Dummy data (tanpa API)
  const initialUsers = useMemo(
    () => [
      { id: 1, nama: "Ariani Putri", role: "User", email: "arianiputri@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
      { id: 2, nama: "Meylani", role: "User", email: "memey@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
      { id: 3, nama: "Ariani Putri", role: "User", email: "memey@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
      { id: 4, nama: "Ariani Putri", role: "User", email: "memey@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
      { id: 5, nama: "Ariani Putri", role: "User", email: "memey@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
      { id: 6, nama: "Ariani Putri", role: "User", email: "memey@gmail.com", telp: "+62 877-1595-3934", status: "Aktif" },
    ],
    []
  );


  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [page, setPage] = useState(1);
  const perPage = 5;


  // style tokens (ikut tema PawKost)
  const titleClass = "text-[#734128] font-extrabold text-[40px] leading-tight";
  const subtitleClass = "mt-1 text-[18px] font-normal text-[#734128]";


  const inputBase = "border-[#B7AB92] bg-white text-[#734128] focus-visible:ring-[#B7AB92]";
  const dropdownBase =
    "appearance-none rounded-md border border-[#B7AB92] bg-[#F0E3D0] px-4 py-2 pr-10 text-sm text-[#734128] " +
    "shadow-[inset_0_2px_8px_rgba(0,0,0,0.14)] outline-none focus:ring-2 focus:ring-[#B7AB92]";


  const tableHead = "text-[#734128] font-bold";
  const tableCell = "text-[#734128]";
  const chipEmail =
    "inline-flex items-center rounded-md border border-[#D9CBB4] bg-[#F0E3D0] px-3 py-1 text-sm text-[#734128]";


  // filtering
  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      u.nama.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.telp.toLowerCase().includes(q);


    const matchStatus = statusFilter === "Semua Status" || u.status === statusFilter;
    return matchQuery && matchStatus;
  });


  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);


  // aksi dropdown (UI saja)
  const handleAction = (id, action) => {
    alert(`User ID: ${id}\nAksi: ${action}\n(UI saja, tanpa API)`);
    // Kalau mau sekadar ubah tampilan status secara lokal (tanpa API), bisa:
    if (action === "Aktifkan") {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Aktif" } : u)));
    }
    if (action === "Nonaktif") {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Nonaktif" } : u)));
    }
    if (action === "Hapus") {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };


  return (
    <div className="bg-white">
      {/* Header (background putih) */}
      <div className="mb-4">
        <h1 className={titleClass}>Daftar User</h1>
        <p className={subtitleClass}>Kelola data pengguna terdaftar di sistem</p>
      </div>


      {/* Card tabel */}
      <div className="rounded-2xl border border-[#D9CBB4] bg-[#F3EDE3] p-4 shadow-sm">
        {/* Search + Filter */}
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#734128]" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari user...."
              className={`${inputBase} pl-9`}
            />
          </div>


          {/* Filter dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={`w-full ${dropdownBase}`}
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#734128]" />
          </div>
        </div>


        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#D9CBB4] bg-[#F3EDE3]">
          {/* Header row */}
          <div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_0.9fr_0.8fr] gap-3 border-b border-[#D9CBB4] bg-[#F3EDE3] px-4 py-3">
            <div className={tableHead}>Nama</div>
            <div className={tableHead}>Email</div>
            <div className={tableHead}>No. Telepon</div>
            <div className={tableHead}>Status Akun</div>
            <div className={tableHead}>Aksi</div>
          </div>


          {/* Rows */}
          <div className="bg-[#F3EDE3]">
            {rows.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[1.2fr_1.4fr_1.2fr_0.9fr_0.8fr] gap-3 px-4 py-3 border-b border-[#E7DCCB] last:border-b-0"
              >
                {/* Nama + avatar */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-[#734128] bg-white">
                    <img src="/avatar.png" alt="avatar" className="h-full w-full object-cover" />
                  </div>
                  <div className="leading-tight">
                    <div className="font-bold text-[#734128]">{u.nama}</div>
                    <div className="text-xs text-[#734128] opacity-80">{u.role}</div>
                  </div>
                </div>


                {/* Email */}
                <div className={tableCell}>
                  <span className={chipEmail}>{u.email}</span>
                </div>


                {/* Telepon */}
                <div className={tableCell}>{u.telp}</div>


                {/* Status */}
                <div className="flex items-center">
                  <span
                    className={[
                      "inline-flex min-w-[74px] justify-center rounded-md px-3 py-1 text-sm font-bold text-white",
                      u.status === "Aktif" ? "bg-green-600" : "bg-gray-500",
                    ].join(" ")}
                  >
                    {u.status}
                  </span>
                </div>


                {/* Aksi */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="h-9 bg-[#EDE7DD] text-[#734128] font-semibold hover:bg-[#e2dacd]"
                    onClick={() => alert(`Lihat detail user: ${u.nama}\n(UI saja)`)}
                  >
                    Lihat
                  </Button>


                  {/* Dropdown aksi */}
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        handleAction(u.id, val);
                        e.target.value = "";
                      }}
                      className="h-9 appearance-none rounded-md border border-[#B7AB92] bg-[#EDE7DD] px-3 pr-9 text-sm font-semibold text-[#734128]
                                 outline-none hover:bg-[#e2dacd]"
                    >
                      <option value="">Edit</option>
                      <option value="Aktifkan">Aktifkan</option>
                      <option value="Nonaktif">Nonaktif</option>
                      <option value="Hapus">Hapus</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#734128]"
                    />
                  </div>
                </div>
              </div>
            ))}


            {rows.length === 0 && (
              <div className="px-4 py-8 text-center text-[#734128]">Tidak ada user yang cocok.</div>
            )}
          </div>
        </div>


        {/* Pagination */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className="h-8 w-8 rounded-md border border-[#D9CBB4] bg-[#F0E3D0] text-[#734128] font-bold hover:opacity-90"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>


          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={[
                "h-8 w-8 rounded-md border border-[#D9CBB4] text-[#734128] font-bold",
                p === currentPage ? "bg-[#F0E3D0]" : "bg-white hover:bg-[#f7f2ea]",
              ].join(" ")}
            >
              {p}
            </button>
          ))}


          <button
            type="button"
            className="h-8 w-8 rounded-md border border-[#D9CBB4] bg-[#F0E3D0] text-[#734128] font-bold hover:opacity-90"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}



