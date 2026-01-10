import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_API = "https://694a827d26e870772065b9ec.mockapi.io/api/v2/admin";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Kalau sudah login, jangan bisa balik ke login page
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (isLoggedIn) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(ADMIN_API);
      if (!res.ok) throw new Error("HTTP error");

      const admins = await res.json();

      const admin = admins.find(
        (a) => a.username === username && a.password === password
      );

      if (!admin) {
        setError("Username atau password salah");
        setLoading(false);
        return;
      }

      // ✅ login berhasil
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_username", admin.username);

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F2EA] flex items-center justify-center">
      <div className="relative w-[980px] h-[560px]">
        {/* OYEN */}
        <img
          src="/images/oyen.png"
          alt="Oyen"
          className="absolute left-[35px] bottom-[10px] w-[480px]
                     drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]"
        />

        {/* CARD LOGIN */}
        <div
          className="absolute left-[320px] top-[280px] -translate-y-1/2 w-[380px] rounded-2xl"
          style={{
            backgroundColor: "#E7E0D6",
            border: "2px solid #734128",
            boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
          }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Greeting */}
            <div className="text-[#734128] font-bold text-[20px] leading-snug">
              Hallo
              <br />
              Selamat Datang Admin
            </div>

            {/* Title */}
            <div
              className="mt-0.5 text-[48px] font-black leading-none"
              style={{
                color: "#FFFFFF",
                WebkitTextStroke: "2.6px #150D0",
                textShadow: "0 2px 0 rgba(0,0,0,0.04)",
              }}
            >
              Sign in
            </div>

            {/* NOTIF ERROR */}
            {error && (
              <div className="mt-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="mt-6">
              <label className="block text-[12px] font-semibold text-[#6E4A2E] mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-[42px] rounded-full bg-white px-4 text-sm
                           text-[#6E4A2E] outline-none border border-[#D2C4B3]
                           focus:ring-2 focus:ring-[#B7AB92]"
              />
            </div>

            {/* Password */}
            <div className="mt-5">
              <label className="block text-[12px] font-semibold text-[#6E4A2E] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[42px] rounded-full bg-white px-4 text-sm
                           text-[#6E4A2E] outline-none border border-[#D2C4B3]
                           focus:ring-2 focus:ring-[#B7AB92]"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-[38px] px-6 rounded-md
                         bg-[#B7AB92] text-white font-bold
                         shadow-sm hover:brightness-95 active:brightness-90
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Memeriksa..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
