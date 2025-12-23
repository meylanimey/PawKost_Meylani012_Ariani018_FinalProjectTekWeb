export default function DataTable({
  rows = [],
  onDelete = () => {},
  onStartEdit = () => {},
}) {
  if (!rows.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-600">
        Data kost belum ada.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
            <th className="px-4 py-3">Nama Kost</th>
            <th className="px-4 py-3">Tipe Kost</th>
            <th className="px-4 py-3">Harga Kost</th>
            <th className="px-4 py-3 text-right">Keterangan</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t text-sm transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-900">
                {row.name}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {row.type ?? "-"}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {row.price ?? "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
                    onClick={() => {
                      console.log("[CLICK EDIT]", row);
                      onStartEdit(row);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 active:scale-95"
                    onClick={() => {
                      console.log("[CLICK DELETE]", row.id, row.name);
                      onDelete(row.id);
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
