"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Result = {
  valid: boolean;
  alreadyCheckedIn?: boolean;
  firstname?: string;
  lastname?: string;
  error?: string;
  checkedInAt?: string;
};

function extractTicketId(raw: string) {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("ticket");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  } catch {
    // not a URL — treat as raw ticket id
  }
  return trimmed;
}

export default function UsherScanner() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const boxId = "usher-qr-reader";

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  async function checkIn(ticketId: string) {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, usherPin: pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ valid: false, error: data.error || "Check-in failed" });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ valid: false, error: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function startScan() {
    setResult(null);
    setScanning(true);
    await new Promise((r) => setTimeout(r, 50));

    const scanner = new Html5Qrcode(boxId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        async (decoded) => {
          await scanner.stop().catch(() => {});
          scannerRef.current = null;
          setScanning(false);
          const id = extractTicketId(decoded);
          await checkIn(id);
        },
        () => {}
      );
    } catch {
      setScanning(false);
      setResult({
        valid: false,
        error: "Camera unavailable. Use manual ticket ID below.",
      });
    }
  }

  async function stopScan() {
    await scannerRef.current?.stop().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
  }

  if (!unlocked) {
    return (
      <div className="usher-gate">
        <h2>Usher access</h2>
        <p>Enter the usher PIN to open the scanner.</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          className="pin-input"
        />
        <button
          type="button"
          className="cta"
          onClick={() => setUnlocked(true)}
          disabled={!pin}
        >
          Unlock scanner
        </button>
      </div>
    );
  }

  return (
    <div className="usher-panel">
      <div className="scan-actions">
        {!scanning ? (
          <button type="button" className="cta" onClick={startScan} disabled={busy}>
            Scan QR code
          </button>
        ) : (
          <button type="button" className="cta secondary" onClick={stopScan}>
            Stop camera
          </button>
        )}
      </div>

      {scanning && <div id={boxId} className="scanner-box" />}

      <form
        className="manual"
        onSubmit={(e) => {
          e.preventDefault();
          if (manualId.trim()) checkIn(extractTicketId(manualId));
        }}
      >
        <label>
          <span>Or enter ticket ID</span>
          <input
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Paste ticket UUID"
          />
        </label>
        <button type="submit" className="cta secondary" disabled={busy || !manualId}>
          Check in
        </button>
      </form>

      {result && (
        <div
          className={`result ${
            !result.valid
              ? "bad"
              : result.alreadyCheckedIn
                ? "warn"
                : "good"
          }`}
        >
          {!result.valid && <p>{result.error || "Invalid ticket"}</p>}
          {result.valid && (
            <>
              <p className="guest">
                {result.firstname} {result.lastname}
              </p>
              <p>
                {result.alreadyCheckedIn
                  ? "Already checked in"
                  : "Checked in — welcome!"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
