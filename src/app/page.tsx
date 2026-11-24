import GoldScene from "@/components/GoldScene";
import RegistrationForm from "@/components/RegistrationForm";

export default function HomePage() {
  return (
    <>
      <GoldScene />
      <main className="page-shell">
        <p className="brand-mark">Theos Tribe · Music Banquet &apos;26</p>
        <h1 className="hero-title">HIS PRESENCE</h1>
        <p className="verse">2 CORINTHIANS 3:18</p>

        <div className="event-meta">
          <strong>SUN. 6TH NOV. 2026 · 5PM</strong>
          <span>
            1204 Production Studio, Adjacent Ok Event Center, Ibara Housing
            Estate, Abeokuta, Ogun State
          </span>
        </div>

        <section className="panel" aria-labelledby="reg-heading">
          <h2 id="reg-heading">Reserve your seat</h2>
          <p className="lede">
            Registration compulsory. Limited to 50 guests — you&apos;ll get a QR
            pass to show at the door.
          </p>
          <RegistrationForm />
        </section>

        <p className="footer-note">Limited spaces · Registration compulsory</p>
      </main>
    </>
  );
}
