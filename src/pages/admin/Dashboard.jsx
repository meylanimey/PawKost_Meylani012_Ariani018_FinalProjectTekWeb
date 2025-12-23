import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AdminHeader from "@/components/admin/AdminHeader";
import FormData from "@/components/admin/FormData";
import DataTable from "@/components/admin/DataTable";

export default function Dashboard({
  kosts = [],
  onAdd = () => {},
  onDelete = () => {},
  onEdit = () => {},
}) {
  const { state } = useLocation();
  const selectedKost = state?.selectedKost;

  const [editingKost, setEditingKost] = useState(null);

  // auto tambah dari tombol Sewa
  useEffect(() => {
    if (!selectedKost) return;
    const exists = kosts.some((k) => k.id === selectedKost.id);
    if (!exists) {
      console.log("[SEWA] masuk dashboard:", selectedKost);
      onAdd(selectedKost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKost]);

  return (
    <div>
      <section className="mx-auto w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-12 lg:py-20 space-y-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AdminHeader />
          <p className="mt-1 text-sm text-slate-600">Kelola data kost.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              {editingKost ? "Edit Kost" : "Tambah Kost"}
            </h3>

            <FormData
              onAdd={onAdd}
              onEdit={(updated) => {
                console.log("[EDIT SUBMIT]", updated);
                onEdit(updated);
                setEditingKost(null);
              }}
              editingKost={editingKost}
              onCancelEdit={() => setEditingKost(null)}
            />
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Daftar Kost
              </h3>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                Total: {kosts.length}
              </span>
            </div>

            <DataTable
              rows={kosts}
              onDelete={onDelete}
              onStartEdit={(row) => {
                console.log("[CLICK EDIT]", row);
                setEditingKost(row);
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
