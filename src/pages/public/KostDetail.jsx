import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { kosts } from "../../data/kosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function KostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const kost = useMemo(() => kosts.find((k) => k.id === id), [id]);

  if (!kost) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-slate-700">Data kost tidak ditemukan.</p>
        <Button
          variant="outline"
          className="mt-4 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
          onClick={() => navigate("/")}
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const handleCheckout = () => {
    // pindah ke dashboard + bawa data kost yang dipilih
    navigate("/dashboard", {
      state: {
        selectedKost: kost,
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Button
        variant="outline"
        className="mb-6 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
        onClick={() => navigate(-1)}
      >
        ← Kembali
      </Button>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <img src={kost.image} alt={kost.name} className="h-80 w-full object-cover" />

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {kost.type && <Badge variant="secondary">{kost.type}</Badge>}
            <Badge variant="outline">{kost.id}</Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{kost.name}</h1>
            <p className="mt-1 text-slate-600">{kost.address}</p>
          </div>

          <p className="text-slate-700">{kost.description}</p>

          <div className="flex flex-wrap gap-2">
            {(kost.facilities ?? []).map((f) => (
              <Badge key={f} variant="secondary">
                {f}
              </Badge>
            ))}
          </div>

          <p className="text-xl font-bold text-indigo-600">
            {rupiah(kost.price)} / bulan
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="outline"
              className="sm:w-auto border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              onClick={handleCheckout}
            >
              Sewa
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="sm:w-auto border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              onClick={() => console.log("Tanya pemilik:", kost.id)}
            >
              Tanya Pemilik
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
