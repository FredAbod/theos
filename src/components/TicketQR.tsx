"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Props = {
  ticketId: string;
  name: string;
};

export default function TicketQR({ ticketId, name }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!origin || !canvasRef.current) return;

    const payload = `${origin}/ticket/${ticketId}`;

    QRCode.toCanvas(canvasRef.current, payload, {
      width: 280,
      margin: 2,
      color: {
        dark: "#0a1f0a",
        light: "#fffef5",
      },
      errorCorrectionLevel: "H",
    })
      .then(() => setReady(true))
      .catch(console.error);
  }, [origin, ticketId]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `theos-ticket-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="qr-block">
      <canvas ref={canvasRef} className="qr-canvas" />
      <button type="button" className="cta" onClick={download} disabled={!ready}>
        Download QR code
      </button>
      <p className="hint">
        Show this at the entrance. Ushers will scan to confirm your seat.
      </p>
    </div>
  );
}
