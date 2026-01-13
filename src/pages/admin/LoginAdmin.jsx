import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "@/api/mockapi";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (isLoggedIn) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(USERS_ENDPOINT);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${text}`);
      }

      const users = await res.json();
      const list = Array.isArray(users) ? users : [];

      const input = String(username || "")
        .trim()
        .toLowerCase();
      const pass = String(password || "");

      const found = list.find((u) => {
        const uUsername = String(u?.username || "").toLowerCase();
        const uEmail = String(u?.email || "").toLowerCase();
        const uName = String(u?.name || u?.nama || "").toLowerCase();
        const uPass = String(u?.password || "");

        const matchIdentity =
          uUsername === input || uEmail === input || uName === input;

        return matchIdentity && uPass === pass;
      });

      if (!found) {
        setError("Username atau password salah");
        setLoading(false);
        return;
      }

      const role = String(found?.role || "").toLowerCase();
      if (role !== "admin") {
        setError("Akun ini bukan admin. Silakan login sebagai admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem(
        "admin_username",
        found.username || found.email || found.name || "admin"
      );

      localStorage.setItem(
        "paw_admin",
        JSON.stringify({
          id: found.id,
          name: found.name ?? found.nama ?? "Admin",
          email: found.email ?? "",
          username: found.username ?? "",
          role: found.role ?? "admin",
          avatar: found.avatar ?? "",
        })
      );

      window.dispatchEvent(new Event("paw_admin_auth_change"));

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

        <div
          className="absolute left-[320px] top-[280px] -translate-y-1/2 w-[380px] rounded-2xl"
          style={{
            backgroundColor: "#E7E0D6",
            border: "2px solid #734128",
            boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
          }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="text-[#734128] font-bold text-[20px] leading-snug">
              Hallo
              <br />
              Selamat Datang Admin
            </div>

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

            {error && (
              <div className="mt-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

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
