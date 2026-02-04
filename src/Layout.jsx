import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import BottomNav from "./components/BottomNav";

export default function Layout() {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/auth") || pathname === "/admin";

  return (
    <div className="appShell">
      <AppHeader />
      <main className="appMain">
        <div className="container">
          <Outlet />
        </div>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
