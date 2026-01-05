import { Link } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";

import editIcon from "../../assets/icons/edit.png";
import trashIcon from "../../assets/icons/trash.png";

function formatRupiah(n) {
  const num = Number(n || 0);
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function DataTable({ rows = [], onDelete = () => {} }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-sm text-[#734128]/70">
        Data kost belum ada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#EFEAE2]">
            <TableHead className="w-[150px] text-center font-bold text-[#734128]">
              Foto
            </TableHead>
            <TableHead className="text-center font-bold text-[#734128]">
              Nama Kost
            </TableHead>
            <TableHead className="text-center font-bold text-[#734128]">
              Tipe
            </TableHead>
            <TableHead className="text-center font-bold text-[#734128]">
              Status
            </TableHead>
            <TableHead className="text-center font-bold text-[#734128]">
              Harga
            </TableHead>
            <TableHead className="text-center font-bold text-[#734128]">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="border-b border-[#F1E7DB] bg-[#FBF4EA]"
            >
  
              <TableCell className="py-4">
                <div className="mx-auto h-16 w-28 overflow-hidden rounded-2xl bg-[#F6EFE6] shadow-sm">
                  {row.image && (
                    <img
                      src={row.image}
                      alt={row.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </TableCell>

              
              <TableCell className="py-4 text-xs font-semibold text-[#734128]">
                {row.name}
              </TableCell>

              
              <TableCell className="py-4">
                <Badge className="rounded-full bg-[#EFE1D3] px-4 py-1 text-[11px] font-semibold text-[#734128]">
                  {row.type}
                </Badge>
              </TableCell>

              
              <TableCell className="py-4">
                <Badge className="rounded-full bg-[#2F8F4E] px-5 py-1 text-[11px] font-semibold text-white">
                  {row.status ?? "Tersedia"}
                </Badge>
              </TableCell>

              
              <TableCell className="py-4 text-xs text-[#734128]">
                Rp. {formatRupiah(row.price)}/bulan
              </TableCell>

              
              <TableCell className="py-4">
                <div className="flex justify-end gap-3">
                  
                  <Button
                    asChild
                    className="
                      h-8 min-w-[96px]
                      rounded-xl
                      !bg-[#F0E4D6]
                      px-4
                      text-[11px]
                      font-bold
                      !text-[#734128]
                      hover:!bg-[#e4d4c1]
                    "
                  >
                    <Link to={`/admin/edit/${row.id}`}>
                      <span className="flex w-full items-center justify-center gap-2">
                        <img
                          src={editIcon}
                          alt=""
                          className="h-3.5 w-3.5 object-contain"
                        />
                        Edit
                      </span>
                    </Link>
                  </Button>

                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="
                          h-8 min-w-[96px]
                          rounded-xl
                          !bg-[#734128]
                          px-4
                          text-[11px]
                          font-bold
                          !text-white
                          hover:!bg-[#5f3412]
                        "
                      >
                        <span className="flex w-full items-center justify-center gap-2">
                          <img
                            src={trashIcon}
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                          />
                          Hapus
                        </span>
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[420px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#734128]">
                          Hapus Kost
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          Apakah kamu yakin ingin menghapus kost ini? Tindakan
                          ini tidak dapat dibatalkan.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="rounded-xl">
                            Batal
                          </Button>
                        </DialogClose>

                        <Button
                          className="rounded-xl bg-[#A86932] font-semibold text-black hover:bg-[#8f5828]"
                          onClick={() => onDelete(row.id)}
                        >
                          Ya, Hapus
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
