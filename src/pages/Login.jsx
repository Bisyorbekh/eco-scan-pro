import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !password) return toast.error("Email va parolni kiriting");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || data?.message || "Login error");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      toast.success(`Logged in (${data.role})`);
      navigate("/scan");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="card authCard">
        <div className="authTop">
          <div className="authLogo">
            <img src="/logo.svg" alt="Eco Scan" style={{ width: 28, height: 28 }} />
          </div>
          <div>
            <h2 className="authTitle">Login</h2>
            <div className="authSub">Welcome back — continue scanning & earning</div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="••••••••"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="iconBtn"
                onClick={() => setShow((s) => !s)}
                title="Show / Hide"
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 14 }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="helperRow">
            <div>
              No account?{" "}
              <Link className="link" to="/auth/register">
                Register
              </Link>
            </div>
            <div className="muted">Eco Scan • Secure</div>
          </div>
        </form>
      </div>
    </div>
  );
}
