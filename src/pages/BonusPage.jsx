import { useEffect, useState } from "react";
const API = "http://127.0.0.1:5000";

export default function BonusPage() {
  const token = localStorage.getItem("token");
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const r = await fetch(`${API}/api/bonus/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setS(await r.json());
  };

  const claim = async () => {
    setMsg("Claim...");
    const r = await fetch(`${API}/api/bonus/claim`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await r.json();
    setMsg(r.ok ? `✅ +${d.added} UZS` : `❌ ${d.message || "Error"}`);
    load();
  };

  useEffect(() => { load(); }, []);

  if (!s) return <div style={{ padding: 16 }}>Loading...</div>;

  const pct = Math.min(100, Math.round((s.scans / s.targetScans) * 100));

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Monthly Bonus</h2>

      <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 14, padding: 12 }}>
        <div><b>{s.month}</b></div>
        <div style={{ marginTop: 8 }}>Scans: <b>{s.scans}</b> / {s.targetScans}</div>

        <div style={{ marginTop: 10, height: 12, background: "#eee", borderRadius: 999 }}>
          <div style={{ height: 12, width: `${pct}%`, background: "#111", borderRadius: 999 }} />
        </div>

        <div style={{ marginTop: 10 }}>Bonus: <b>{s.monthlyBonus} UZS</b></div>

        <button
          onClick={claim}
          disabled={!s.eligible}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 12,
            borderRadius: 14,
            border: "none",
            background: s.eligible ? "#111" : "#999",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {s.bonusClaimed ? "Claimed ✅" : s.eligible ? "Claim Bonus" : "Not ready"}
        </button>

        {msg ? <p style={{ marginTop: 10, fontWeight: 700 }}>{msg}</p> : null}
      </div>
    </div>
  );
}
