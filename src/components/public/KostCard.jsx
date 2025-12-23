import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function KostCard({ kost }) {
  const facilities = kost.facilities ?? [];
  const showFacilities = facilities.slice(0, 3);
  const rest = facilities.length - showFacilities.length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="relative">
        <img
          src={kost.image}
          alt={kost.name}
          className="h-48 w-full object-cover"
        />

        {/* Badge Type */}
        {kost.type && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-white/90 text-slate-900">
              {kost.type}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
            {kost.name}
          </h3>
          <p className="line-clamp-1 text-sm text-slate-600">
            {kost.address}
          </p>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2">
          {showFacilities.map((f) => (
            <Badge key={f} variant="secondary">
              {f}
            </Badge>
          ))}
          {rest > 0 && (
            <Badge variant="secondary" className="text-slate-600">
              +{rest}
            </Badge>
          )}
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-slate-900">
          {rupiah(kost.price)}{" "}
          <span className="text-sm font-medium text-slate-600">/ bulan</span>
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/detail/${kost.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Detail
            </Button>
          </Link>

          <Button
            className="flex-1 bg-slate-900 text-black hover:bg-slate-800"
            onClick={() =>
              console.log("Sewa kost:", kost.id, kost.name)
            }
          >
            Sewa
          </Button>
        </div>
      </div>
    </div>
  );
}
