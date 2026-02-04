import { useEffect, useState } from "react";
import { API } from "../config";
import toast from "react-hot-toast";

export default function WalletPage() {
  const token = localStorage.getItem("token");
  const [wallet, setWallet] = useState(null);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const w = await fetch(`${API}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      const t = await fetch(`${API}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      setWallet(w);
      setTx(Array.isArray(t) ? t : []);
    } catch (e) {
      toast.error(e.message || "Wallet load error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h2 className="cardTitle">Wallet</h2>
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="card">
        <h2 className="cardTitle">Wallet</h2>
        <p className="muted">No data</p>
        <button className="btn" style={{ marginTop: 12 }} onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <h2 className="cardTitle" style={{ marginBottom: 6 }}>Wallet</h2>
            <div className="muted">Balances by wallet type</div>
          </div>
          <button className="btn" style={{ width: 140, height: 44 }} onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {Object.entries(wallet.balances || {}).map(([k, v]) => (
          <div key={k} className="card">
            <div className="muted" style={{ fontWeight: 900, letterSpacing: 0.6 }}>
              {k.toUpperCase()}
            </div>
            <div style={{ fontSize: 26, fontWeight: 950, marginTop: 6 }}>
              {v} <span className="muted">UZS</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="cardTitle" style={{ marginBottom: 6 }}>History</h3>
        <div className="muted">Last transactions</div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {tx.length === 0 ? (
            <div className="muted">No transactions yet.</div>
          ) : (
            tx.map((item) => (
              <div key={item._id} className="card" style={{ background: "var(--card2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <b>{item.type}</b>
                  <b>{item.amount} UZS</b>
                </div>
                <div className="muted" style={{ marginTop: 8 }}>
                  {item.walletType} • {new Date(item.createdAt).toLocaleString()}
                </div>
                {item.note ? (
                  <div style={{ opacity: 0.9, marginTop: 8 }}>{item.note}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
