import { useEffect, useMemo, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";
import { API } from "../config";


const WALLETS = ["transport", "paynet", "supermarket", "ebook"];

export default function ScanPage() {
  const token = localStorage.getItem("token");
  const [walletType, setWalletType] = useState("transport");
  const [msg, setMsg] = useState("");
  const [lastScan, setLastScan] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const scannerId = useMemo(() => "qr-reader", []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: { width: 260, height: 260 } },
      false
    );

    scanner.render(async (decodedText) => {
      if (isBusy) return; // double-scan blok
      setIsBusy(true);

      try {
        const r = await fetch(`${API}/api/scan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qrCode: decodedText, walletType }),
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d?.message || "Scan failed");

        setMsg(`✅ +${d.added} UZS (${d.walletType})`);
        setLastScan({
          amount: d.added,
          walletType: d.walletType,
          time: new Date().toLocaleString(),
        });

        toast.success(`+${d.added} UZS → ${d.walletType}`);
      } catch (e) {
        setMsg(`❌ ${e.message}`);
        toast.error(e.message || "Scan error");
      } finally {
        // 1.2sdan keyin yana scan qila olsin
        setTimeout(() => setIsBusy(false), 1200);
      }
    });

    return () => {
      try {
        scanner.clear();
      } catch {}
    };
  }, [scannerId, token, walletType, isBusy]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h2 className="cardTitle">Scan & Earn</h2>
        <p className="muted">
          Choose wallet, scan QR, and your reward will be added instantly.
        </p>

        <div className="binsRow">
          <div className="binCard">
            <img src="/qr-icons/plastic.png" alt="Plastic" className="binIcon" />
            <div className="binName">Plastic</div>
          </div>
          <div className="binCard">
            <img src="/qr-icons/paper.png" alt="Paper" className="binIcon" />
            <div className="binName">Paper</div>
          </div>
          <div className="binCard">
            <img src="/qr-icons/glass.png" alt="Glass" className="binIcon" />
            <div className="binName">Glass</div>
          </div>
        </div>

        <div className="segWrap">
          {WALLETS.map((t) => (
            <button
              key={t}
              className={"segBtn" + (walletType === t ? " active" : "")}
              onClick={() => setWalletType(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 10 }}>
          Camera scanner
        </div>
        <div id={scannerId} className="scannerBox" />
        <div style={{ marginTop: 10 }} className="muted">
          {isBusy ? "Processing..." : "Ready to scan"}
        </div>
        {msg ? <div style={{ marginTop: 10, fontWeight: 850 }}>{msg}</div> : null}
      </div>

      {lastScan ? (
        <div className="card">
          <h3 className="cardTitle" style={{ marginBottom: 6 }}>Last scan</h3>
          <div className="muted">
            +{lastScan.amount} UZS • {lastScan.walletType} • {lastScan.time}
          </div>
        </div>
      ) : null}
    </div>
  );
}
