// src/components/public/KostCard.jsx
function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function TypePill({ type }) {
  const map = {
    Putra: "bg-blue-500/15 text-blue-200 ring-blue-500/30",
    Putri: "bg-pink-500/15 text-pink-200 ring-pink-500/30",
    Campur: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
  };
  const cls = map[type] ?? "bg-white/10 text-white/80 ring-white/20";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {type}
    </span>
  );
}

export default function KostCard({ kost, onRent, onDetail }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/20">
      <div className="relative">
        <img
          src={kost.image}
          alt={kost.name}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <TypePill type={kost.type} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-white">
            {kost.name}
          </h3>
          <p className="line-clamp-1 text-sm text-white/60">{kost.address}</p>
        </div>

        <p className="line-clamp-2 text-sm text-white/70">{kost.description}</p>

        <div className="flex flex-wrap gap-2">
          {kost.facilities.slice(0, 3).map((f) => (
            <span
              key={f}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80 ring-1 ring-white/10"
            >
              {f}
            </span>
          ))}
          {kost.facilities.length > 3 && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/60 ring-1 ring-white/10">
              +{kost.facilities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-white/70">
            <span className="text-base font-semibold text-white">
              {rupiah(kost.price)}
            </span>{" "}
            / bulan
          </p>

          <div className="flex gap-2">
            <button
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              onClick={() => {
                console.log("Detail diklik:", kost.id);
                onDetail?.(kost);
              }}
            >
              Detail
            </button>

            <button
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90 active:scale-[0.99]"
              onClick={() => {
                console.log("Sewa diklik:", kost.id);
                onRent?.(kost);
              }}
            >
              Sewa
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
