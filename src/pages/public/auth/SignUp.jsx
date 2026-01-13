import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "@/api/mockapi";

export default function Signup() {
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

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

  const normalizePhone = (raw) => String(raw || "").replace(/\D/g, "");
  const safeTrim = (v) => String(v ?? "").trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const nameV = safeTrim(name);
    const emailV = safeTrim(email).toLowerCase();
    const phoneV = normalizePhone(phone);

    if (!nameV || !emailV || !phoneV || !password) {
      setErr("Semua field wajib diisi.");
      return;
    }

    if (password !== confirm) {
      setErr("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      try {
        const checkRes = await fetch(USERS_ENDPOINT);
        if (checkRes.ok) {
          const list = await checkRes.json();
          const exists = Array.isArray(list)
            ? list.some((u) => String(u?.email || "").toLowerCase() === emailV)
            : false;

          if (exists) {
            setErr("Email sudah terdaftar. Silakan gunakan email lain.");
            return;
          }
        }
      } catch {}

      const payload = {
        name: nameV,
        phone: phoneV,
        email: emailV,
        password: String(password),
        role: "user",
        status: "Aktif",
        avatar: "",
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(USERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gagal daftar. (${res.status}) ${text}`);
      }

      await res.json();

      navigate("/", { replace: true });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (e2) {
      setErr(e2?.message || "Gagal daftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden lg:block overflow-hidden bg-[#F7EEDB]">
          <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#C6A892]/70" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#C6A892]/70" />

          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-[520px] h-[520px]">
              <div
                className="
                  absolute
                  left-1/2
                  bottom-6
                  -translate-x-1/2
                  w-[420px]
                  h-[170px]
                  pointer-events-none
                "
                style={{
                  background:
                    "radial-gradient(closest-side at 50% 60%, rgba(143,103,83,0.45), rgba(143,103,83,0.18) 55%, rgba(143,103,83,0.0) 75%)",
                }}
              />

              <div
                className="
                  absolute
                  left-1/2
                  bottom-16
                  -translate-x-1/2
                  w-[240px]
                  h-[80px]
                  pointer-events-none
                "
                style={{
                  background:
                    "radial-gradient(closest-side at 50% 60%, rgba(80,50,38,0.22), rgba(80,50,38,0.08) 55%, rgba(80,50,38,0.0) 75%)",
                }}
              />

              <img
                src="/images/ilustrasi-kucing.png"
                alt="Ilustrasi Kucing"
                className="
                  absolute left-1/2 top-1/2
                  -translate-x-1/2 -translate-y-1/2
                  max-h-[480px] w-auto
                  z-10 select-none
                "
                draggable={false}
              />
            </div>
          </div>
        </section>

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
            <h1 className="mb-8 text-center text-[52px] sm:text-[64px] font-extrabold text-[#754A34]">
              Daftar
            </h1>

            {err && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 whitespace-pre-line">
                {err}
              </div>
            )}

            <div
              className="
                max-h-[calc(100vh-180px)]
                overflow-y-auto overflow-x-hidden
                px-6 -mx-6 pr-2
                auth-scroll
              "
            >
              <form onSubmit={onSubmit} className="space-y-5 pb-6">
                <Field label="Nama">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama"
                    className="input-auth"
                  />
                </Field>

                <Field label="No. Telepon">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Masukkan No. Telepon"
                    className="input-auth"
                  />
                </Field>

                <Field label="Alamat Email">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan alamat email"
                    className="input-auth"
                  />
                </Field>

                <Field label="Kata Sandi">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="input-auth"
                  />
                </Field>

                <Field label="Konfirmasi Kata Sandi">
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Masukkan ulang kata sandi"
                    className="input-auth"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2 w-full rounded-[22px]
                    bg-[#C6A892]
                    px-8 py-4
                    text-[20px] font-semibold text-white
                    shadow-[0_14px_30px_rgba(0,0,0,0.12)]
                    hover:brightness-95
                    active:scale-[0.99]
                    transition
                    disabled:opacity-60
                  "
                >
                  {loading ? "Memproses..." : "Daftar"}
                </button>

                <p className="pt-4 text-center text-[15px] text-black/50">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => goTo("/login")}
                    className="font-semibold text-[#8B6F5C] hover:underline"
                  >
                    Masuk
                  </button>
                </p>
              </form>
            </div>
          </div>

          <style>{`
            .auth-scroll::-webkit-scrollbar { width: 8px; }
            .auth-scroll::-webkit-scrollbar-thumb {
              background: rgba(198,168,146,.55);
              border-radius: 999px;
            }
            .auth-scroll::-webkit-scrollbar-track { background: transparent; }


            .input-auth {
              width: 100%;
              border-radius: 18px;
              background: white;
              padding: 16px 24px;
              font-size: 16px;
              color: #6B4B3B;
              box-shadow: 0 10px 26px rgba(0,0,0,0.08);
              outline: none;
              border: 1px solid rgba(0,0,0,0.05);
            }


            .input-auth:focus {
              border-color: rgba(0,0,0,0.15);
            }
          `}</style>
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