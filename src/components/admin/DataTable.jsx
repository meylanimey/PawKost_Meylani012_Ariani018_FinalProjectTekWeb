import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotebookPen, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTable({ kosts = [], onDelete }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const statusVariant = (status) => {
    const s = String(status || "").toLowerCase();
    return s === "penuh" ? "destructive" : "default";
  };

  const confirmDelete = () => {
    if (!selected?.id) return;
    onDelete?.(selected.id);
    setSelected(null);
  };

  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Kelola Kost</h1>
        <Button onClick={() => navigate("/admin/kost/tambah")}>
          Tambah Kost
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kost</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {kosts.map((k) => (
            <TableRow key={k.id}>
              <TableCell className="font-medium">
                {k.nama ?? k.name ?? "Nama Kost"}
              </TableCell>

              <TableCell>{k.harga ? `Rp ${k.harga}` : "-"}</TableCell>

              <TableCell>
                <Badge variant={statusVariant(k.status)}>
                  {k.status ?? "tersedia"}
                </Badge>
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/admin/kost/${k.id}/edit`)}
                >
                  <NotebookPen size={16} />
                </Button>

                <Dialog
                  open={selected?.id === k.id}
                  onOpenChange={(open) => !open && setSelected(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setSelected(k)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <TriangleAlert size={18} /> Hapus Kost?
                      </DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-600">
                      Yakin ingin menghapus{" "}
                      <span className="font-semibold">
                        {selected?.nama ?? selected?.name}
                      </span>
                      ?
                    </p>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setSelected(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={confirmDelete}
                      >
                        Hapus
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}

          {kosts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                Belum ada data kost.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}