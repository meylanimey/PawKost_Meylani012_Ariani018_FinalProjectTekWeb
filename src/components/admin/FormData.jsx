import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


export default function FormData({
  onAdd = () => {},
  onEdit = () => {},
  editingKost = null,
  onCancelEdit = () => {},
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Campur");
  const [price, setPrice] = useState("");


  useEffect(() => {
    if (!editingKost) return;
    setName(editingKost.name ?? "");
    setType(editingKost.type ?? "Campur");
    setPrice(String(editingKost.price ?? ""));
  }, [editingKost]);


  const resetForm = () => {
    setName("");
    setType("Campur");
    setPrice("");
  };


  const handleSubmit = (e) => {
    e.preventDefault();


    if (editingKost) {
      onEdit({
        ...editingKost,
        name,
        type,
        price: Number(price),
      });
      resetForm();
      return;
    }


    onAdd({
      id: crypto.randomUUID(),
      name,
      type,
      price: Number(price),
    });
    resetForm();
  };


  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-slate-900">Data Kost</h3>


      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Nama Kost
        </label>
        <Input
          className="rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Kost Melati"
          required
        />
      </div>


      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Tipe
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Putra</option>
          <option>Putri</option>
          <option>Campur</option>
        </select>
      </div>


      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Harga / bulan
        </label>
        <Input
          className="rounded-xl"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Contoh: 850000"
          inputMode="numeric"
          required
        />
      </div>


      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 rounded-xl">
          {editingKost ? "Simpan" : "Tambah"}
        </Button>


        {editingKost && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleCancel}
          >
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}



