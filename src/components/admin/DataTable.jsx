export default function DataTable({ rows, onDelete, onEdit }) {
  return (
    <div className="border rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">Nama Kost</th>
            <th className="text-left p-3">Tipe Kost</th>
            <th className="text-left p-3">Harga Kost</th>
            <th className="text-left p-3">Keterangan</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.name}</td>
              <td className="p-3">{r.type}</td>
              <td className="p-3">Rp {Number(r.price).toLocaleString("id-ID")}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(r)}
                  className="border rounded-lg px-3 py-1 text-xs hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(r)}
                  className="border rounded-lg px-3 py-1 text-xs hover:bg-gray-100"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-3 text-gray-500">
                Data kosong
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
