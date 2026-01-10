import { Input } from "@/components/ui/input";

export default function FormData({ form, onChange }) {
  return (
    <div className="space-y-3">
      <Input
        name="nama"
        value={form.nama}
        onChange={onChange}
        placeholder="Nama Kost"
      />
      <Input
        name="harga"
        value={form.harga}
        onChange={onChange}
        placeholder="Harga / bulan"
      />
      <Input
        name="status"
        value={form.status}
        onChange={onChange}
        placeholder="Status (tersedia/penuh)"
      />
    </div>
  );
}
