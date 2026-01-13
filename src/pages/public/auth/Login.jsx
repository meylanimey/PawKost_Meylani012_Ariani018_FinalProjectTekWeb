import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "@/api/mockapi";

export default function Login() {
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const goTo = (path) => {
    setLeaving(true);
    setTimeout(() => navigate(path), 260);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const value = (emailOrUsername || "").trim();
    if (!value) {
      setErr("Nama pengguna atau email wajib diisi.");
      return;
    }
    if (!password) {
      setErr("Kata sandi wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(USERS_ENDPOINT);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal mengambil data user. (${res.status}) ${text}`);
      }

      const users = await res.json();
      const list = Array.isArray(users) ? users : [];

      const needle = value.toLowerCase();

      const found = list.find((u) => {
        const email = String(u?.email || "").toLowerCase();
        const username = String(u?.username || "").toLowerCase();
        const name = String(u?.name || u?.nama || "").toLowerCase();
        const pass = String(u?.password || "");

        const matchIdentity =
          email === needle || username === needle || name === needle;

        return matchIdentity && pass === String(password);
      });

      if (!found) {
        throw new Error("Email/username atau kata sandi salah.");
      }

      const loggedUser = {
        id: found.id,
        name: found.name ?? found.nama ?? "User",
        email: found.email ?? "",
        phone: found.phone ?? "",
        role: found.role ?? "user",
        status: found.status ?? "Aktif",
        avatar: found.avatar ?? "",
      };

      localStorage.setItem("paw_user", JSON.stringify(loggedUser));

      window.dispatchEvent(new Event("paw_auth_change"));

      navigate("/", { replace: true });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (e2) {
      setErr(e2?.message || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <section className="relative flex items-center justify-center bg-white px-5 sm:px-8 py-10">
          <div
            className={[
              "w-full max-w-md transition-all duration-500 ease-out",
              mounted && !leaving
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2",
              leaving ? "opacity-0 -translate-y-1" : "",
            ].join(" ")}
          >
            <h1 className="mb-8 text-center text-[52px] sm:text-[64px] leading-none font-extrabold text-[#754A34]">
              Masuk
            </h1>

            {err && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <Field label="Nama Pengguna atau Alamat Email">
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna dan alamat email"
                  autoComplete="username"
                  className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                             shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-black/10 transition"
                />
              </Field>

              <Field label="Kata Sandi">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  className="w-full rounded-[18px] bg-white px-6 py-4 text-[16px] text-[#6B4B3B]
                             shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-black/10 transition"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-[22px] bg-[#C6A892] px-8 py-4 text-[20px] font-semibold text-white
                           shadow-[0_14px_30px_rgba(0,0,0,0.12)]
                           hover:brightness-95 active:scale-[0.99] transition
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

              <p className="pt-4 text-center text-[15px] text-black/50">
                Tidak memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => goTo("/signup")}
                  className="font-semibold text-[#8B6F5C] hover:underline"
                >
                  Daftar
                </button>
              </p>
            </form>
          </div>
        </section>

        <section className="relative hidden lg:block overflow-hidden bg-[#F7EEDB]">
          <img
            src="/images/kucing-pintu.png"
            alt="Kucing Pintu"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[18px] font-semibold text-[#8B6F5C]">
        {label}
      </label>
      {children}
    </div>
  );
}