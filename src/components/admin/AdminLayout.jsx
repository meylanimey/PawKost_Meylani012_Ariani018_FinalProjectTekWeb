import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  House,
  NotebookPen,
  SquarePlus,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { USERS_ENDPOINT } from "@/api/mockapi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);

  const [admin, setAdmin] = useState(() => readLocalAdmin());
  const [adminLoading, setAdminLoading] = useState(true);

  const abortRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setOpenMobile(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (!isLoggedIn) {
      setAdminLoading(false);
      return;
    }

    const local = readLocalAdmin();
    setAdmin(local);

    const localId = local?.id ? String(local.id) : "";
    const usernameKey = String(localStorage.getItem("admin_username") || "")
      .trim()
      .toLowerCase();

    if (!localId && !usernameKey) {
      doLogout(true);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      setAdminLoading(true);
      try {
        let fresh = null;

        if (localId) {
          const res = await fetch(`${USERS_ENDPOINT}/${localId}`, {
            signal: controller.signal,
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Gagal memuat admin. (${res.status}) ${text}`);
          }
          fresh = await res.json();
        } else {
          const res = await fetch(USERS_ENDPOINT, {
            signal: controller.signal,
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Gagal memuat admin. (${res.status}) ${text}`);
          }
          const list = await res.json();
          const arr = Array.isArray(list) ? list : [];

          fresh = arr.find((u) => {
            const uUsername = String(u?.username || "").toLowerCase();
            const uEmail = String(u?.email || "").toLowerCase();
            const uName = String(u?.name || u?.nama || "").toLowerCase();
            return (
              uUsername === usernameKey ||
              uEmail === usernameKey ||
              uName === usernameKey
            );
          });
        }

        const role = String(fresh?.role || "").toLowerCase();
        if (role !== "admin") {
          doLogout(true);
          return;
        }

        const normalized = {
          id: fresh?.id,
          name: fresh?.name ?? fresh?.nama ?? "Admin",
          email: fresh?.email ?? "",
          username: fresh?.username ?? "",
          role: fresh?.role ?? "admin",
          avatar: fresh?.avatar ?? "",
        };

        setAdmin(normalized);
        localStorage.setItem("paw_admin", JSON.stringify(normalized));
      } catch (e) {
        if (e?.name === "AbortError") return;
        const fallback = readLocalAdmin();
        if (!fallback?.id && !fallback?.name) doLogout(true);
      } finally {
        setAdminLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const avatarSrc = useMemo(
    () => (admin?.avatar ? admin.avatar : "/avatar.png"),
    [admin?.avatar]
  );

  const adminName = useMemo(() => admin?.name || "Admin", [admin?.name]);

  const doLogout = (silent = false) => {
    if (abortRef.current) abortRef.current.abort();

    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("paw_admin");

    setOpenMobile(false);

    if (!silent) {
      navigate("/", { replace: true });
    } else {
      navigate("/admin/login", { replace: true });
    }
  };

  const SidebarInner = ({ isMobile = false }) => (
    <div
      className="w-full overflow-hidden"
      style={{
        height: 550,
        backgroundColor: "#EEEBE6",
        borderRadius: 30,
        padding: 16,
        border: "1px solid #E5D5C0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={avatarSrc}
          alt="avatar"
          className="h-16 w-16 rounded-full border-2 border-[#734128] bg-white object-cover"
        />
        <div className="mt-2 text-[15px] font-bold text-[#734128]">
          {adminLoading ? "Memuat..." : adminName}
        </div>
        <div className="text-[11px] font-medium text-[#734128]">
          Admin PawKost
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <SidebarLink
          to="/admin"
          icon={<House size={18} className="text-[#734128]" />}
          label="Dashboard"
          onClick={() => isMobile && setOpenMobile(false)}
        />
        <SidebarLink
          to="/admin/kost"
          icon={<NotebookPen size={18} className="text-[#734128]" />}
          label="Kelola Kost"
          onClick={() => isMobile && setOpenMobile(false)}
        />
        <SidebarLink
          to="/admin/kost/tambah"
          icon={<SquarePlus size={18} className="text-[#734128]" />}
          label="Tambah Kost"
          onClick={() => isMobile && setOpenMobile(false)}
        />
        <SidebarLink
          to="/admin/users"
          icon={<Users size={18} className="text-[#734128]" />}
          label="Daftar User"
          onClick={() => isMobile && setOpenMobile(false)}
        />

        <button
          type="button"
          onClick={() => doLogout(false)}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold text-[#734128] bg-transparent hover:bg-white/50 transition"
        >
          <LogOut size={18} className="text-[#734128]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#EFE4D0] border-b border-[#E5D5C0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <img
              src="/logo-pawkost.png"
              alt="PAWKOST"
              className="w-14 h-14 object-contain"
            />
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#6F4417]">PAW</span>
              <span className="text-3xl font-normal text-[#8F6753]">KOST</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpenMobile(true)}
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/70 hover:bg-white transition border border-[#E5D5C0]"
            aria-label="Open menu"
          >
            <Menu className="text-[#734128]" />
          </button>
        </div>
      </header>

      <aside
        className="hidden sm:block fixed z-40"
        style={{ left: 14, top: 93, width: 240, height: 550 }}
      >
        <SidebarInner />
      </aside>

      {openMobile && (
        <div className="sm:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close backdrop"
            onClick={() => setOpenMobile(false)}
            className="absolute inset-0 bg-black/35"
          />

          <div className="absolute left-3 top-[5.75px] w-[17.5px]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMobile(false)}
                className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-white border border-[#E5D5C0] shadow flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="text-[#734128]" size={20} />
              </button>
              <SidebarInner isMobile />
            </div>
          </div>
        </div>
      )}

      <main className="px-4 py-4 sm:px-0 sm:py-0 sm:ml-[278px] sm:pt-6">
        <div className="sm:pr-6 sm:pl-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
          "text-[15px] font-bold text-[#734128]",
          isActive ? "bg-white shadow-sm" : "hover:bg-white/60",
        ].join(" ")
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function readLocalAdmin() {
  try {
    const raw = localStorage.getItem("paw_admin");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
