import { NavLink, Outlet, useNavigate } from "react-router-dom";


import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";


import homeIcon from "../../assets/icons/home.png";
import plusIcon from "../../assets/icons/plus.png";
import logoutIcon from "../../assets/icons/logout.png";


const navItemClass = ({ isActive }) =>
  [
    "flex items-center gap-3 px-4 py-3 rounded-xl transition active:scale-[0.99]",
    "text-[#734128] text-sm font-semibold",
    isActive ? "bg-white shadow-sm" : "hover:bg-white/60",
  ].join(" ");


export default function AdminLayout() {
  const navigate = useNavigate();


  const handleLogout = () => {
    navigate("/", { replace: true });
  };


  return (
    <div className="min-h-screen bg-white">
      <header className="relative w-full bg-[#E7DCC6] px-6 py-3 shadow-sm">
        <div className="flex items-end leading-none">
          <img
            src={logo}
            alt="PAWKOST"
            className="h-[35px] w-[45px] object-contain scale-165"
          />
          <span className="text-[45px] font-extrabold tracking-tight text-[#6F4417]">
            PAW
          </span>
          <span className="text-[45px] font-medium tracking-tight text-[#8F6753]">
            KOST
          </span>
        </div>
      </header>


      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="w-[265px] bg-white px-5 py-6">
          <div className="flex h-[calc(100vh-130px)] flex-col rounded-[28px] bg-[#EFEAE2] px-5 py-6">
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <img
                src={avatar}
                alt="Admin"
                className="h-14 w-14 rounded-full bg-white object-cover"
              />
              <div>
                <p className="text-sm font-extrabold text-[#734128]">Armey</p>
                <p className="text-[11px] text-[#734128]/70">Admin PawKost</p>
              </div>
            </div>


            <nav className="space-y-2">
              <NavLink to="/admin" end className={navItemClass}>
                <img src={homeIcon} alt="" className="h-5 w-5 object-contain" />
                Dashboard
              </NavLink>


              <NavLink to="/admin/add" className={navItemClass}>
                <img src={plusIcon} alt="" className="h-5 w-5 object-contain" />
                Tambah Kost
              </NavLink>
            </nav>


            <div className="flex-1" />


            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#734128] hover:bg-white/60 active:scale-[0.99]"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="" className="h-5 w-5 object-contain" />
              Keluar
            </button>
          </div>
        </aside>


        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



