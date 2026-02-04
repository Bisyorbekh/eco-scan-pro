import { Link, useLocation } from "react-router-dom";

export default function AppHeader() {
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith("/auth");

  return (
    <header className="appHeader">
      <Link to="/" className="brand">
        <img src="/logo.svg" alt="EcoScan" className="brandLogo" />
        <div className="brandText">
          <div className="brandName">Eco Scan</div>
          <div className="brandTag">Green rewards • QR • Wallet</div>
        </div>
      </Link>

      {!isAuth && (
        <div className="pill">
          <span className="dot" />
          Live
        </div>
      )}
    </header>
  );
}
