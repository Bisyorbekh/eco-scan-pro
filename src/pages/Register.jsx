import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API } from "../config";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Hamma maydonlarni to‘ldiring");
    if (password.length < 6) return toast.error("Parol kamida 6 ta belgidan iborat bo‘lsin");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || data?.message || "Register error");

      toast.success("Registered ✅ Now login!");
      navigate("/auth/login");
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
            <h2 className="authTitle">Create account</h2>
            <div className="authSub">Join Eco Scan and start earning rewards</div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Name</div>
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
                placeholder="min 6 characters"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="helperRow">
            <div>
              Have an account?{" "}
              <Link className="link" to="/auth/login">
                Login
              </Link>
            </div>
            <div className="muted">Eco Scan • Fast signup</div>
          </div>
        </form>
      </div>
    </div>
  );
}
