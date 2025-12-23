import { useState } from "react";

export default function FormData({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Campur");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, type, price });
    setName("");
    setType("Campur");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-xl p-4 space-y-3">
      <h3 className="font-semibold">Data Kost</h3>

      <div>
        <label className="block text-sm font-medium">Nama Kost</label>
        <input
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Kost Melati"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tipe</label>
        <select
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Putra</option>
          <option>Putri</option>
          <option>Campur</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Harga / bulan</label>
        <input
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Contoh: 850000"
          inputMode="numeric"
        />
      </div>

      <button className="bg-pink-500 hover:bg-pink-400-600 text-white px-10 py-4 rounded-lg text-sm font-semibold">
        Tambah
      </button>
    </form>
  );
}
