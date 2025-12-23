import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function KostCard({ kost }) {
  return (
    <div className="rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
      <img
        src={kost.image}
        alt={kost.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{kost.name}</h3>

        <p className="text-sm text-gray-500">{kost.location}</p>

        <div className="flex flex-wrap gap-2">
          {kost.facilities.map((f, i) => (
            <Badge key={i} variant="secondary">
              {f}
            </Badge>
          ))}
        </div>

        <p className="font-bold text-indigo-600">
          Rp {kost.price.toLocaleString("id-ID")} / bulan
        </p>

        <div className="flex gap-2">
          <Link to={`/detail/${kost.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Detail
            </Button>
          </Link>

          <Button
            className="flex-1"
            onClick={() => console.log("Checkout:", kost.name)}
          >
            Sewa
          </Button>
        </div>
      </div>
    </div>
  );
}