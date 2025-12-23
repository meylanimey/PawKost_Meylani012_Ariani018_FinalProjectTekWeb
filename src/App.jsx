import { useState } from "react";
import Dashboard from "@/pages/admin/Dashboard";
import { initialKosts } from "@/data/kosts";

export default function App() {
  const [kosts, setKosts] = useState(initialKosts);

  const onAdd = ({ name, type, price }) => {
    if (!name.trim() || !price.trim()) return;

    const newItem = {
      id: String(Date.now()),
      name,
      type,
      price: Number(price),
    };

    console.log("[ADD]", newItem);
    setKosts((prev) => [newItem, ...prev]);
  };

  const onDelete = (item) => {
    console.log("[DELETE]", item);
    setKosts((prev) => prev.filter((k) => k.id !== item.id));
  };

  const onEdit = (item) => {
    console.log("[EDIT] CP1 log saja:", item);
  };

  return <Dashboard kosts={kosts} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} />;
}
