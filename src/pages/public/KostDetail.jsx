// src/pages/public/KostDetail.jsx
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

export default function KostDetail({ kost, onBack }) {
  if (!kost) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            ← Kembali
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold">Detail Kost</p>
            <p className="text-xs text-white/60">{kost.id}</p>
          </div>
          <button
            onClick={() => console.log("Simpan:", kost.id)}
            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="relative">
              <img src={kost.image} alt={kost.name} className="h-72 w-full object-cover" />
              <div className="absolute left-4 top-4">
                <TypePill type={kost.type} />
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <h1 className="text-2xl font-bold">{kost.name}</h1>
                <p className="mt-1 text-sm text-white/60">{kost.address}</p>
              </div>

              <p className="text-sm text-white/70">{kost.description}</p>

              <div>
                <p className="text-sm font-semibold">Fasilitas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {kost.facilities.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Harga</p>
            <p className="mt-1 text-3xl font-bold">{rupiah(kost.price)}</p>
            <p className="mt-1 text-sm text-white/60">per bulan</p>

            <div className="mt-6 grid gap-3">
              <button
                onClick={() => console.log("Sewa dari detail:", kost.id)}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90 active:scale-[0.99]"
              >
                Sewa Sekarang
              </button>
              <button
                onClick={() => console.log("Tanya pemilik:", kost.id)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              >
                Tanya Pemilik
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
