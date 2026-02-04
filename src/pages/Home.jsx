import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Eco-scan ✅</h1>
      <p>Welcome. Choose:</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {!token ? (
          <>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/scan">Scan ♻️</Link>
            <Link to="/wallet">Wallet 💰</Link>
            <Link to="/bonus">Bonus 🎁</Link>
            <Link to="/pay">Pay 🧾</Link>
          </>
        )}
        <Link to="/admin">Admin</Link>
        {role === "admin" ? <Link to="/admin">Admin</Link> : null}
      </div>
    </div>
  );
}
