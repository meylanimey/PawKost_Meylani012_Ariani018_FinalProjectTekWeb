import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";


export default function Login() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");


    try {
      setLoading(true);
      await login({ email, password, rememberMe });
      navigate("/", { replace: true });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (e) {
      setErr(e?.message || "Gagal login.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <section className="relative flex items-center justify-center bg-white px-5 sm:px-6 py-10 sm:py-12">
          <div className="absolute top-5 left-5 sm:top-8 sm:left-8 flex items-center gap-2">
            <img
              src="/logo-pawkost.png"
              alt="PAWKOST"
              className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
              draggable={false}
            />
            <span className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#6F4417]">
              PAWKOST
            </span>
          </div>


          <div
            className={[
              "w-full max-w-md transition-all duration-700 ease-out",
              "pt-14 sm:pt-16",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            ].join(" ")}
          >
            <h1
              className="mb-8 sm:mb-10 text-left text-[44px] sm:text-[56px] leading-none font-bold text-[#754A34]"
              style={{
                WebkitTextStroke: "2px rgba(143, 103, 83, 0.62)",
                paintOrder: "stroke fill",
              }}
            >
              Masuk
            </h1>


            {err && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {err}
              </div>
            )}


            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[16px] sm:text-[18px] font-medium text-[#8B6F5C]">
                  Nama Pengguna atau Alamat Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="ariani@gmail.com"
                  className="w-full rounded-[16px] bg-white px-5 sm:px-6 py-3.5 text-[15px] sm:text-[16px] text-[#9B9B9B]
                             shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-[#C6A892]/50 transition"
                  required
                />
              </div>


              <div className="space-y-2">
                <label className="block text-[16px] sm:text-[18px] font-medium text-[#8B6F5C]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-[16px] bg-white px-5 sm:px-6 py-3.5 pr-12 text-[15px] sm:text-[16px] text-[#9B9B9B]
                               shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                               outline-none ring-1 ring-black/5
                               focus:ring-2 focus:ring-[#C6A892]/50 transition"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#6B4A3A]"
                    aria-label="Tampilkan kata sandi"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>


              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-[#C6A892] text-[#C6A892]
                               focus:ring-2 focus:ring-[#C6A892]/50"
                  />
                  <span className="text-[14px] sm:text-[15px] text-[#9B9B9B]">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[14px] sm:text-[15px] text-[#9B9B9B] hover:text-[#8B6F5C] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-[20px] bg-[#C6A892] px-8 py-3.5 text-[18px] sm:text-[20px] font-semibold text-white
                           shadow-[0_8px_20px_rgba(198,168,146,0.3)]
                           hover:brightness-95 active:scale-[0.99] transition
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>


              <p className="pt-6 text-center text-[14px] sm:text-[15px] text-[#9B9B9B]">
                Tidak memiliki akun?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-[#8B6F5C] hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </form>
          </div>
        </section>


        <section className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-[#E8D4B8] to-[#D4B896]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/images/kucing-pintu.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "100%",
            }}
          />
        </section>
      </div>
    </main>
  );
}





