import { useEffect, useMemo, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:5000";

export default function PayPage() {
  const token = localStorage.getItem("token");
  const scannerId = useMemo(() => "pay-reader", []);
  const [msg, setMsg] = useState("");
  const lastRef = useRef("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: { width: 260, height: 260 } },
      false
    );

    scanner.render(async (decodedText) => {
      if (decodedText === lastRef.current) return;
      lastRef.current = decodedText;

      try {
        const r = await fetch(`${API}/api/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payload: decodedText }),
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Pay error");

        const okMsg = `✅ Paid ${d.paid} UZS (${d.walletType}) → ${d.merchantName}`;
        setMsg(okMsg);
        toast.success(okMsg);
      } catch (e) {
        setMsg(`❌ ${e.message}`);
        toast.error(e.message);
      }
    });

    return () => { try { scanner.clear(); } catch {} };
  }, [scannerId, token]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Pay</h2>
      <p style={{ opacity: 0.8 }}>Scan merchant QR to pay.</p>
      <div id={scannerId} style={{ marginTop: 12 }} />
      {msg ? <p style={{ marginTop: 12, fontWeight: 800 }}>{msg}</p> : null}
    </div>
  );
}
