import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

import { KOSTS_ENDPOINT } from "@/api/mockapi";

export default function DataKost() {
  const navigate = useNavigate();

  const [kosts, setKosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiErr, setApiErr] = useState("");

  const [q, setQ] = useState("");
  const [tipe, setTipe] = useState("Semua Tipe");
  const [status, setStatus] = useState("Semua Status");
  const [daerah, setDaerah] = useState("Semua Daerah");
  const [publish, setPublish] = useState("Semua");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [openDelete, setOpenDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setApiErr("");
      try {
        const res = await fetch(KOSTS_ENDPOINT);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil data (${res.status}) ${text}`);
        }
        const data = await res.json();
        if (alive) setKosts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setApiErr(e?.message || "Gagal ambil data");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    setApiErr("");
    try {
      const res = await fetch(KOSTS_ENDPOINT);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal refresh (${res.status}) ${text}`);
      }
      const data = await res.json();
      setKosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setApiErr(e?.message || "Gagal refresh");
    } finally {
      setLoading(false);
    }
  };

  const getId = (k) => k?.id;

  const getName = (k) => k?.nama ?? k?.name ?? "-";
  const getDaerah = (k) => k?.daerah ?? "-";
  const getLokasi = (k) => k?.lokasi ?? k?.location ?? "-";

  const getTipe = (k) => k?.jenis ?? k?.type ?? "-";

  const getHarga = (k) => k?.harga ?? k?.price ?? null;

  const getStatus = (k) => k?.status ?? "Tersedia";

  const getImage = (k) =>
    k?.urlGambar ?? k?.image ?? "https://picsum.photos/seed/kost/240/160";

  const getNomorPemilik = (k) => k?.nomorPemilik ?? "-";

  const getIsPublished = (k) => !!(k?.isPublished ?? false);

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

  const publishOptions = ["Semua", "Published", "Draft"];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return kosts.filter((k) => {
      const nama = String(getName(k) || "").toLowerCase();
      const alamat = String(getLokasi(k) || "").toLowerCase();
      const kota = String(getDaerah(k) || "").toLowerCase();

      const matchQ =
        !query ||
        nama.includes(query) ||
        alamat.includes(query) ||
        kota.includes(query);

      const matchTipe = tipe === "Semua Tipe" || String(getTipe(k)) === tipe;

      const matchStatus =
        status === "Semua Status" || String(getStatus(k)) === status;

      const matchDaerah =
        daerah === "Semua Daerah" || String(getDaerah(k)) === daerah;

      const matchPublish =
        publish === "Semua" ||
        (publish === "Published" && getIsPublished(k)) ||
        (publish === "Draft" && !getIsPublished(k));

      return matchQ && matchTipe && matchStatus && matchDaerah && matchPublish;
    });
  }, [kosts, q, tipe, status, daerah, publish]);

  const totalData = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalData / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const updateKost = async (id, patch) => {
    setApiErr("");
    setBusyId(id);
    try {
      const nowIso = new Date().toISOString();
      const res = await fetch(`${KOSTS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, updatedAt: nowIso }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal update (${res.status}) ${text}`);
      }

      const updated = await res.json();
      setKosts((prev) =>
        prev.map((k) => (String(k.id) === String(id) ? updated : k))
      );
    } catch (e) {
      setApiErr(e?.message || "Gagal update data");
    } finally {
      setBusyId(null);
    }
  };

  const deleteKost = async (id) => {
    setApiErr("");
    setBusyId(id);
    try {
      const res = await fetch(`${KOSTS_ENDPOINT}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal hapus (${res.status}) ${text}`);
      }
      setKosts((prev) => prev.filter((k) => String(k.id) !== String(id)));
    } catch (e) {
      setApiErr(e?.message || "Gagal hapus data");
    } finally {
      setBusyId(null);
    }
  };

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

  const publishPill = (isPublished) => {
    const bg = isPublished ? "#2563eb" : "#6b7280";
    return (
      <span
        className="inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-bold text-white"
        style={{ backgroundColor: bg }}
      >
        {isPublished ? "Published" : "Draft"}
      </span>
    );
  };

  const askDelete = (kost) => {
    setPendingDelete(kost);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    const id = pendingDelete?.id;
    setOpenDelete(false);
    setPendingDelete(null);
    if (id != null) await deleteKost(id);
  };

  const cancelDelete = () => {
    setOpenDelete(false);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[56px] font-extrabold leading-none text-[#734128]">
            Daftar Kost
          </h1>
          <p className="mt-1 text-[16px] font-semibold text-[#8F6753]">
            Kelola seluruh data kost yang terdaftar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="h-10 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? "Memuat..." : "Refresh"}
          </Button>
          <Button
            type="button"
            className="h-10 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
            onClick={() => navigate("/admin/kost/tambah")}
          >
            + Tambah
          </Button>
        </div>
      </div>

      {!!apiErr && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-line">
          {apiErr}
        </div>
      )}

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
              placeholder="Cari nama / alamat / kota..."
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

          <select
            className={selectClass}
            value={publish}
            onChange={(e) => {
              setPublish(e.target.value);
              setPage(1);
            }}
          >
            {publishOptions.map((opt) => (
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
              <TableHead className="text-[#734128] font-bold w-[220px]">
                Status
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[200px]">
                Publish
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[210px]">
                No. Pemilik
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[240px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-[#734128]"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paged.map((k) => {
                  const id = getId(k);
                  const isBusy = String(busyId) === String(id);

                  return (
                    <TableRow
                      key={id}
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
                        <div className="leading-tight">{getName(k)}</div>
                        <div className="text-xs text-[#8F6753] mt-1">
                          {getLokasi(k)}
                        </div>
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
                          <select
                            className="h-9 rounded-lg border border-[#E5D5C0] bg-white px-2 text-sm font-semibold text-[#734128] disabled:opacity-60"
                            value={getStatus(k) || ""}
                            disabled={isBusy}
                            onChange={(e) =>
                              updateKost(id, { status: e.target.value })
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
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {publishPill(getIsPublished(k))}
                          <select
                            className="h-9 rounded-lg border border-[#E5D5C0] bg-white px-2 text-sm font-semibold text-[#734128] disabled:opacity-60"
                            value={getIsPublished(k) ? "Published" : "Draft"}
                            disabled={isBusy}
                            onChange={(e) =>
                              updateKost(id, {
                                isPublished: e.target.value === "Published",
                              })
                            }
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </TableCell>

                      <TableCell className="text-[#734128] font-semibold">
                        {getNomorPemilik(k)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => navigate(`/detail/${id}`)}
                            className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                            disabled={isBusy}
                          >
                            <Eye size={16} className="mr-2" />
                            Detail
                          </Button>

                          <Button
                            variant="secondary"
                            className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                            onClick={() => navigate(`/admin/kost/${id}/edit`)}
                            type="button"
                            disabled={isBusy}
                          >
                            <Pencil size={16} className="mr-2" />
                            Edit
                          </Button>

                          <Button
                            variant="secondary"
                            className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                            onClick={() => askDelete(k)}
                            type="button"
                            disabled={isBusy}
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {paged.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-[#734128]"
                    >
                      Tidak ada data yang cocok.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>

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

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#734128]">Hapus Kost?</DialogTitle>
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
