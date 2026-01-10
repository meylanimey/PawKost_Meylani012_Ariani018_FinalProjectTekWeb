import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function AuthLayout() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [dir, setDir] = useState("right");

  useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;

    if (from === "/login" && to === "/signup") setDir("right");
    else if (from === "/signup" && to === "/login") setDir("left");
    else setDir("right");

    prevPath.current = to;
  }, [location.pathname]);

  return (
    <main className="h-screen overflow-hidden bg-white">
      <div key={location.pathname} className={`auth-enter auth-${dir}`}>
        <Outlet />
      </div>

      <style>{`
        .auth-enter{
          animation-duration: 520ms;
          animation-timing-function: cubic-bezier(.2,.9,.15,1);
          animation-fill-mode: both;
          will-change: transform, opacity, filter;
        }
        .auth-right{ animation-name: authInRight; }
        .auth-left{  animation-name: authInLeft; }

        @keyframes authInRight{
          from { opacity: 0; transform: translateX(26px) scale(.985); filter: blur(6px); }
          to   { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes authInLeft{
          from { opacity: 0; transform: translateX(-26px) scale(.985); filter: blur(6px); }
          to   { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
      `}</style>
    </main>
  );
}
