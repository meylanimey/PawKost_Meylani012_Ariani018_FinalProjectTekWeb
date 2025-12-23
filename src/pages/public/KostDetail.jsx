import { useParams } from "react-router-dom";
import { kosts } from "../../data/kosts";
import { Button } from "@/components/ui/button";

export default function KostDetail() {
  const { id } = useParams();
  const kost = kosts.find((k) => k.id === id);

  if (!kost) {
    return <p className="p-6">Data kost tidak ditemukan</p>;
  }

  const handleCheckout = () => {
    const message = `Halo, saya ingin booking ${kost.name}`;
    window.open(
      `https://wa.me/628123456789?text=${encodeURIComponent(message)}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <img
        src={kost.image}
        className="rounded-xl h-80 w-full object-cover mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{kost.name}</h1>
      <p className="text-gray-500 mb-4">{kost.location}</p>

      <p className="mb-4">{kost.description}</p>

      <p className="text-xl font-bold text-indigo-600 mb-6">
        Rp {kost.price.toLocaleString("id-ID")} / bulan
      </p>

      <Button size="lg" onClick={handleCheckout}>
        Sewa via WhatsApp
      </Button>
    </div>
  );
}