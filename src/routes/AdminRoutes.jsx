import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import RequireAdmin from "./RequireAdmin";

import Dashboard from "../pages/admin/Dashboard";
import DataKost from "../pages/admin/DataKost";
import AddKost from "../pages/admin/AddKost";
import EditKost from "../pages/admin/EditKost";
import LoginAdmin from "../pages/admin/LoginAdmin";
import DaftarUser from "../pages/admin/DaftarUser";
import EditUser from "../pages/admin/EditUser";

export default function AdminRoutes({ kosts, onAdd, onEdit, onDelete }) {
  return (
    <Routes>
      <Route path="login" element={<LoginAdmin />} />

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard kosts={kosts} />} />
          <Route
            path="kost"
            element={<DataKost kosts={kosts} onDelete={onDelete} />}
          />
          <Route path="kost/tambah" element={<AddKost onAdd={onAdd} />} />
          <Route
            path="kost/:id/edit"
            element={<EditKost kosts={kosts} onEdit={onEdit} />}
          />
          <Route path="users" element={<DaftarUser />} />
          <Route path="users/:id/edit" element={<EditUser />} />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
