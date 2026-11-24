import GoldScene from "@/components/GoldScene";
import UsherScanner from "@/components/UsherScanner";

export const metadata = {
  title: "Usher Scan | HIS PRESENCE",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return (
    <>
      <GoldScene />
      <main className="page-shell">
        <p className="brand-mark">Theos Tribe · Usher desk</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}>
          Check in
        </h1>
        <p className="verse">SCAN GUEST QR CODES</p>

        <section className="panel">
          <UsherScanner />
        </section>
      </main>
    </>
  );
}
