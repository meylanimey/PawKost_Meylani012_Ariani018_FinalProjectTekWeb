import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/lib/auth";


export default function Signup() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");


    if (password !== confirmPassword) {
      setErr("Kata sandi tidak cocok.");
      return;
    }


    try {
      setLoading(true);
      await signup({ email, password });
      navigate("/", { replace: true });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (e) {
      setErr(e?.message || "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Ilustrasi (kucing) */}
        <section className="relative hidden lg:block overflow-hidden bg-[#F7EEDB]">
          <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#C6A892]/70" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#C6A892]/70" />


          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-[640px] h-[640px]">
              {/* shadow (geser kanan + bawah), bentuk elips bulat */}
              <div
                className="absolute bottom-2 translate-x-32
                           w-[420px] h-[260px]
                           rounded-full
                           bg-[#8F6753]/60"
              />


              <img
                src="/images/ilustrasi-kucing.png"
                alt="Ilustrasi Kucing"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                           max-h-[560px] w-auto select-none z-10"
                draggable={false}
              />
            </div>
          </div>
        </section>


        {/* RIGHT: Form (dibuat responsif untuk mobile) */}
        <section className="relative flex items-center justify-center bg-white px-5 sm:px-6 py-10 sm:py-12">
          {/* Logo pojok kanan atas */}
          <div className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center gap-2">
            <img
              src="/logo-pawkost.png"
              alt="PAWKOST"
              className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
              draggable={false}
            />
            <div className="flex items-baseline">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#6F4417]">
                PAW
              </span>
              <span className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#8F6753]">
                KOST
              </span>
            </div>
          </div>


          <div
            className={[
              "w-full max-w-md transition-all duration-700 ease-out",
              // biar konten gak ketabrak logo di mobile
              "pt-14 sm:pt-16",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            ].join(" ")}
          >
            <h1 className="mb-8 sm:mb-10 text-center text-[44px] sm:text-[56px] lg:text-[64px] leading-none font-bold text-[#754A34]">
              Daftar
            </h1>


            {err && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {err}
              </div>
            )}


            <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="block text-[16px] sm:text-[18px] font-semibold text-[#8B6F5C]">
                  Masukkan Alamat Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="ariani@gmail.com"
                  className="w-full rounded-[16px] sm:rounded-[18px] bg-white px-5 sm:px-6 py-3.5 sm:py-4 text-[15px] sm:text-[17px] text-[#9B9B9B]
                             shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-black/10 transition"
                  required
                />
              </div>


              <div className="space-y-2">
                <label className="block text-[16px] sm:text-[18px] font-semibold text-[#8B6F5C]">
                  Masukkan Kata Sandi
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full rounded-[16px] sm:rounded-[18px] bg-white px-5 sm:px-6 py-3.5 sm:py-4 text-[15px] sm:text-[17px] text-[#9B9B9B]
                             shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-black/10 transition"
                  required
                />
              </div>


              <div className="space-y-2">
                <label className="block text-[16px] sm:text-[18px] font-semibold text-[#8B6F5C]">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full rounded-[16px] sm:rounded-[18px] bg-white px-5 sm:px-6 py-3.5 sm:py-4 text-[15px] sm:text-[17px] text-[#9B9B9B]
                             shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                             outline-none ring-1 ring-black/5
                             focus:ring-2 focus:ring-black/10 transition"
                  required
                />
              </div>


              <button
                type="submit"
                disabled={loading}
                className="mt-6 sm:mt-8 w-full rounded-[20px] sm:rounded-[22px] bg-[#C6A892] px-8 py-3.5 sm:py-4 text-[18px] sm:text-[22px] font-semibold text-white
                           shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                           hover:brightness-95 active:scale-[0.99] transition
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>


              <p className="pt-4 text-center text-[14px] sm:text-[16px] text-black/50">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#8B6F5C] hover:underline"
                >
                  Masuk
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}





