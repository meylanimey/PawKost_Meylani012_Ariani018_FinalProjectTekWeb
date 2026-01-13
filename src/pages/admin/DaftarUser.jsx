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

import { USERS_ENDPOINT } from "@/api/mockapi";

export default function DaftarUser() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiErr, setApiErr] = useState("");

  const [q, setQ] = useState("");
  const [role, setRole] = useState("Semua Role");
  const [status, setStatus] = useState("Semua Status");

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
        const res = await fetch(USERS_ENDPOINT);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Gagal ambil data (${res.status}) ${text}`);
        }
        const data = await res.json();
        if (alive) setUsers(Array.isArray(data) ? data : []);
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
      const res = await fetch(USERS_ENDPOINT);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal refresh (${res.status}) ${text}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setApiErr(e?.message || "Gagal refresh");
    } finally {
      setLoading(false);
    }
  };

  const getId = (u) => u?.id;

  const getName = (u) => u?.name ?? u?.nama ?? "-";
  const getEmail = (u) => u?.email ?? "-";
  const getPhone = (u) => u?.phone ?? u?.telp ?? "-";
  const getRole = (u) => u?.role ?? "user";
  const getStatus = (u) => u?.status ?? "Aktif";
  const getAvatar = (u) =>
    u?.avatar ??
    u?.photo ??
    u?.image ??
    "https://picsum.photos/seed/user/240/240";

  const roleOptions = useMemo(() => {
    const set = new Set(users.map((u) => String(getRole(u))).filter(Boolean));
    return ["Semua Role", ...Array.from(set)];
  }, [users]);

  const statusOptions = useMemo(() => {
    const set = new Set(users.map((u) => String(getStatus(u))).filter(Boolean));
    return ["Semua Status", ...Array.from(set)];
  }, [users]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return users.filter((u) => {
      const nama = String(getName(u) || "").toLowerCase();
      const email = String(getEmail(u) || "").toLowerCase();
      const phone = String(getPhone(u) || "").toLowerCase();

      const matchQ =
        !query ||
        nama.includes(query) ||
        email.includes(query) ||
        phone.includes(query);

      const matchRole = role === "Semua Role" || String(getRole(u)) === role;

      const matchStatus =
        status === "Semua Status" || String(getStatus(u)) === status;

      return matchQ && matchRole && matchStatus;
    });
  }, [users, q, role, status]);

  const totalData = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalData / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const updateUser = async (id, patch) => {
    setApiErr("");
    setBusyId(id);
    try {
      const nowIso = new Date().toISOString();
      const res = await fetch(`${USERS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, updatedAt: nowIso }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal update (${res.status}) ${text}`);
      }

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (String(u.id) === String(id) ? updated : u))
      );
    } catch (e) {
      setApiErr(e?.message || "Gagal update data");
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id) => {
    setApiErr("");
    setBusyId(id);
    try {
      const res = await fetch(`${USERS_ENDPOINT}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal hapus (${res.status}) ${text}`);
      }
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
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

  const roleChip = (val) => (
    <span className="inline-flex items-center rounded-full bg-[#EFE4D0] px-3 py-1 text-[13px] font-semibold text-[#734128]">
      {val}
    </span>
  );

  const statusPill = (val) => {
    const v = String(val || "").toLowerCase();
    const isAktif = v === "aktif";
    const bg = isAktif ? "#2E8B57" : "#F25C3D";
    return (
      <span
        className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[14px] font-semibold text-white"
        style={{ backgroundColor: bg }}
      >
        {val || "-"}
      </span>
    );
  };

  const askDelete = (user) => {
    setPendingDelete(user);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    const id = pendingDelete?.id;
    setOpenDelete(false);
    setPendingDelete(null);
    if (id != null) await deleteUser(id);
  };

  const cancelDelete = () => {
    setOpenDelete(false);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[56px] font-extrabold leading-none text-[#734128]">
            Daftar User
          </h1>
          <p className="mt-1 text-[16px] font-semibold text-[#8F6753]">
            Kelola seluruh data user yang terdaftar
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
        </div>
      </div>

      {!!apiErr && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-line">
          {apiErr}
        </div>
      )}

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
              placeholder="Cari nama / email / phone..."
              className="pl-10 bg-white border-[#E5D5C0]"
            />
          </div>

          <select
            className={selectClass}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            {roleOptions.map((opt) => (
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
                Avatar
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[260px]">
                Nama
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[240px]">
                Email
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[190px]">
                Phone
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[170px]">
                Role
              </TableHead>
              <TableHead className="text-[#734128] font-bold w-[220px]">
                Status
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
                  colSpan={7}
                  className="py-10 text-center text-[#734128]"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paged.map((u) => {
                  const id = getId(u);
                  const isBusy = String(busyId) === String(id);

                  return (
                    <TableRow
                      key={id}
                      className="bg-[#FBF4EE] border-t border-[#E5D5C0]"
                    >
                      <TableCell>
                        <div className="h-20 w-20 rounded-2xl overflow-hidden border border-[#E5D5C0] bg-white">
                          <img
                            src={getAvatar(u)}
                            alt={getName(u)}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-[#734128] font-semibold">
                        <div className="leading-tight">{getName(u)}</div>
                        <div className="text-xs text-[#8F6753] mt-1">
                          {getRole(u)} • {getStatus(u)}
                        </div>
                      </TableCell>

                      <TableCell className="text-[#734128] font-semibold">
                        {getEmail(u)}
                      </TableCell>

                      <TableCell className="text-[#734128] font-semibold">
                        {getPhone(u)}
                      </TableCell>

                      <TableCell>{roleChip(getRole(u))}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {statusPill(getStatus(u))}
                          <select
                            className="h-9 rounded-lg border border-[#E5D5C0] bg-white px-2 text-sm font-semibold text-[#734128] disabled:opacity-60"
                            value={getStatus(u) || ""}
                            disabled={isBusy}
                            onChange={(e) =>
                              updateUser(id, { status: e.target.value })
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
                          <Button
                            type="button"
                            onClick={() => navigate(`/admin/users/${id}/edit`)}
                            className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                            disabled={isBusy}
                          >
                            <Pencil size={16} className="mr-2" />
                            Edit
                          </Button>

                          <Button
                            variant="secondary"
                            className="h-9 bg-[#F0E3D0] text-[#734128] shadow-[inset_0_0_0_1px_#B7AB92] shadow-inner hover:bg-[#ead9c4]"
                            onClick={() => askDelete(u)}
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
                      colSpan={7}
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
            {Math.min(end, totalData)} data dari {totalData} user
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
            <DialogTitle className="text-[#734128]">Hapus User?</DialogTitle>
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
