import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DataKost({ kosts = [], onDelete, onEdit }) {
  const navigate = useNavigate();

  // UI state
  const [q, setQ] = useState("");
  const [tipe, setTipe] = useState("Semua Tipe");
  const [status, setStatus] = useState("Semua Status");
  const [daerah, setDaerah] = useState("Semua Daerah");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // delete dialog (wajib shadcn Dialog untuk alert hapus)
  const [openDelete, setOpenDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // ==== Normalisasi field (biar nyambung sama dummy data public juga) ====
  const getId = (k) => k?.id;
  const getName = (k) => k?.nama ?? k?.name ?? "-";
  const getDaerah = (k) => k?.daerah ?? k?.location ?? "-";
  const getTipe = (k) => k?.tipe ?? k?.type ?? "-";
  const getHarga = (k) => k?.harga ?? k?.price ?? null;
  const getStatus = (k) => k?.status ?? "Tersedia"; // default
  const getImage = (k) =>
    k?.gambar ??
    k?.image ??
    "https://picsum.photos/seed/kost/240/160";

  // options dari data
  const tipeOptions = useMemo(() => {
    const set = new Set(kosts.map((k) => getTipe(k)).filter(Boolean));
    return ["Semua Tipe", ...Array.from(set)];
  }, [kosts]);

  const statusOptions = useMemo(() => {
    const set = new Set(kosts.map((k) => getStatus(k)).filter(Boolean));
    return ["Semua Status", ...Array.from(set)];
  }, [kosts]);

  const daerahOptions = useMemo(() => {
    const set = new Set(kosts.map((k) => getDaerah(k)).filter(Boolean));
    return ["Semua Daerah", ...Array.from(set)];
  }, [kosts]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return kosts.filter((k) => {
      const nama = String(getName(k) || "").toLowerCase();
      const lokasi = String(getDaerah(k) || "").toLowerCase();

      const matchQ = !query || nama.includes(query) || lokasi.includes(query);
      const matchTipe = tipe === "Semua Tipe" || String(getTipe(k)) === tipe;
      const matchStatus =
        status === "Semua Status" || String(getStatus(k)) === status;
      const matchDaerah =
        daerah === "Semua Daerah" || String(getDaerah(k)) === daerah;

      return matchQ && matchTipe && matchStatus && matchDaerah;
    });
  }, [kosts, q, tipe, status, daerah]);

  const totalData = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalData / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // style helpers
  const cardShell =
    "rounded-2xl border border-[#E5D5C0] bg-white shadow-sm overflow-hidden";

  const selectClass =
    "h-10 rounded-lg border border-[#E5D5C0] bg-white px-3 text-sm font-semibold text-[#734128] outline-none focus:ring-2 focus:ring-[#E5D5C0]";

  const chipTipe = (val) => (
    <span className="inline-flex items-center rounded-full bg-[#EFE4D0] px-3 py-1 text-[13px] font-semibold text-[#734128]">
      {val}
    </span>
  );

  const statusPill = (val) => {
    const v = String(val || "").toLowerCase();
    const isTersedia = v === "tersedia";
    const bg = isTersedia ? "#2E8B57" : "#F25C3D";
    return (
      <span
        className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[14px] font-semibold text-white"
        style={{ backgroundColor: bg }}
      >
        {val || "-"}
      </span>
    );
  };

  const askDelete = (kost) => {
    setPendingDelete(kost);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (pendingDelete?.id != null) onDelete?.(pendingDelete.id);
    setOpenDelete(false);
    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setOpenDelete(false);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-[56px] font-extrabold leading-none text-[#734128]">
          Daftar Kost
        </h1>
        <p className="mt-1 text-[16px] font-semibold text-[#8F6753]">
          Kelola seluruh data kost yang terdaftar
        </p>
      </div>

      {/* Filters bar */}
      <div className="rounded-xl bg-[#FBF4EE] border border-[#F2EFEF] p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[300px] max-w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
            />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama atau lokasi kost..."
              className="pl-10 bg-white border-[#E5D5C0]"
            />
          </div>

          <select
            className={selectClass}
            value={tipe}
            onChange={(e) => {
              setTipe(e.target.value);
              setPage(1);
            }}
          >
            {tipeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={daerah}
            onChange={(e) => {
              setDaerah(e.target.value);
              setPage(1);
            }}
          >
            {daerahOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <Button
            className="h-10 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
            type="button"
            onClick={() => setPage(1)}
          >
            Cari
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className={cardShell}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EFE4D0]">
              <TableHead className="text-[#734128] font-bold w-[150px]">
                Gambar
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[260px]">
                Nama Kost
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[160px]">
                Tipe
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[170px]">
                Harga
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[170px]">
                Status
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[240px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.map((k) => (
              <TableRow
                key={getId(k)}
                className="bg-[#FBF4EE] border-t border-[#E5D5C0]"
              >
                <TableCell>
                  <div className="h-20 w-32 rounded-2xl overflow-hidden border border-[#E5D5C0] bg-white">
                    <img
                      src={getImage(k)}
                      alt={getName(k)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="text-[#734128] font-semibold">
                <div></div>
                  {getName(k)}
                </TableCell>

                <TableCell>{chipTipe(getTipe(k))}</TableCell>

                <TableCell className="text-[#734128] font-semibold">
                  {getHarga(k) != null
                    ? `Rp. ${getHarga(k)} / bulan`
                    : "Rp. - / bulan"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusPill(getStatus(k))}
                    {onEdit ? (
                      <select
                        className="h-9 rounded-lg border border-[#E5D5C0] bg-white px-2 text-sm font-semibold text-[#734128]"
                        value={getStatus(k) || ""}
                        onChange={(e) =>
                          onEdit({ ...k, status: e.target.value })
                        }
                      >
                        {statusOptions
                          .filter((s) => s !== "Semua Status")
                          .map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* DETAIL -> PUBLIC */}
                    <Button
                      type="button"
                      onClick={() => navigate(`/detail/${getId(k)}`)}
                      className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                    >
                      <Eye size={16} className="mr-2" />
                      Detail
                    </Button>

                    {/* EDIT -> ADMIN */}
                    <Button
                      variant="secondary"
                      className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                      onClick={() => navigate(`/admin/kost/${getId(k)}/edit`)}
                      type="button"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </Button>

                    {/* DELETE -> DIALOG */}
                    <Button
                      variant="secondary"
                      className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                      onClick={() => askDelete(k)}
                      type="button"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[#734128]">
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Footer pagination */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#EFE4D0] border-t border-[#E5D5C0]">
          <div className="text-[14px] font-semibold text-[#734128]">
            Menampilkan {totalData === 0 ? 0 : start + 1} sampai{" "}
            {Math.min(end, totalData)} data dari {totalData} kost
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 border-[#E5D5C0] text-[#734128]"
              onClick={() => goPage(safePage - 1)}
              disabled={safePage === 1}
              type="button"
            >
              ‹
            </Button>

            {Array.from({ length: totalPages })
              .slice(0, 5)
              .map((_, idx) => {
                const p = idx + 1;
                const active = p === safePage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goPage(p)}
                    className={`h-9 w-9 rounded-lg text-[14px] font-bold ${
                      active
                        ? "bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92]"
                        : "text-[#734128] hover:bg-[#F0E3D0]/60"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

            <Button
              variant="outline"
              className="h-9 border-[#E5D5C0] text-[#734128]"
              onClick={() => goPage(safePage + 1)}
              disabled={safePage === totalPages}
              type="button"
            >
              ›
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog confirm delete (shadcn) */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#734128]">
              Hapus Kost?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-[#8F6753]">
              Kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-[#734128]">
                {pendingDelete ? getName(pendingDelete) : "-"}
              </span>
              ? Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#E5D5C0] text-[#734128]"
                onClick={cancelDelete}
              >
                Batal
              </Button>
              <Button
                type="button"
                className="bg-[#F25C3D] text-white hover:brightness-95"
                onClick={confirmDelete}
              >
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
