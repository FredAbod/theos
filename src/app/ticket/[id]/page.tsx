import Link from "next/link";
import { notFound } from "next/navigation";
import GoldScene from "@/components/GoldScene";
import TicketQR from "@/components/TicketQR";
import { connectDB } from "@/lib/mongodb";
import { Registrant } from "@/models/Registrant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TicketPage({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const registrant = await Registrant.findOne({ ticketId: id }).lean();

  if (!registrant) notFound();

  const name = `${registrant.firstname} ${registrant.lastname}`;

  return (
    <>
      <GoldScene />
      <main className="page-shell">
        <p className="brand-mark">Theos Tribe · Music Banquet &apos;26</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 7vw, 3.4rem)" }}>
          You&apos;re in
        </h1>
        <p className="verse">HIS PRESENCE · SEAT CONFIRMED</p>

        <section className="panel ticket-card">
          <p className="name">{name}</p>
          <p className="meta">
            {registrant.email}
            <br />
            {registrant.phone}
          </p>
          <p className="ticket-id">Ticket · {registrant.ticketId}</p>

          <TicketQR ticketId={registrant.ticketId} name={name} />
        </section>

        <Link href="/" className="nav-link">
          ← Back to event
        </Link>
      </main>
    </>
  );
}
