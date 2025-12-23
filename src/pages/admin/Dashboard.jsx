import AdminHeader from "@/components/admin/AdminHeader";
import FormData from "@/components/admin/FormData";
import DataTable from "@/components/admin/DataTable";

export default function Dashboard({ kosts, onAdd, onDelete, onEdit }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white border rounded-xl p-5">
          <AdminHeader />
          <p className="text-sm text-gray-600 mt-1">
            Kelola data kost (Checkpoint 1 — dummy).
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Tambah Kost</h3>
            <FormData onAdd={onAdd} />
            <p className="text-xs text-gray-500 mt-4">
              Tips: isi nama, tipe, dan harga lalu klik Tambah.
            </p>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Daftar Kost</h3>
              <span className="text-xs text-gray-500">
                Total: {kosts?.length ?? 0}
              </span>
            </div>
            <DataTable rows={kosts} onDelete={onDelete} onEdit={onEdit} />
          </div>
        </div>
      </section>
    </div>
  );
}
