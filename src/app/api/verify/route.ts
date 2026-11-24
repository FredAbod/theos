import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registrant } from "@/models/Registrant";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId")?.trim();

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
    }

    await connectDB();
    const registrant = await Registrant.findOne({ ticketId }).lean();

    if (!registrant) {
      return NextResponse.json(
        { valid: false, error: "Invalid ticket" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      ticketId: registrant.ticketId,
      firstname: registrant.firstname,
      lastname: registrant.lastname,
      email: registrant.email,
      phone: registrant.phone,
      checkedIn: registrant.checkedIn,
      checkedInAt: registrant.checkedInAt ?? null,
    });
  } catch (error) {
    console.error("Verify GET error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
    const usherPin = typeof body.usherPin === "string" ? body.usherPin : "";

    const expectedPin = process.env.USHER_PIN;
    if (expectedPin && usherPin !== expectedPin) {
      return NextResponse.json({ error: "Invalid usher PIN" }, { status: 401 });
    }

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
    }

    await connectDB();
    const registrant = await Registrant.findOne({ ticketId });

    if (!registrant) {
      return NextResponse.json(
        { valid: false, error: "Invalid ticket" },
        { status: 404 }
      );
    }

    if (registrant.checkedIn) {
      return NextResponse.json({
        valid: true,
        alreadyCheckedIn: true,
        ticketId: registrant.ticketId,
        firstname: registrant.firstname,
        lastname: registrant.lastname,
        checkedInAt: registrant.checkedInAt,
      });
    }

    registrant.checkedIn = true;
    registrant.checkedInAt = new Date();
    await registrant.save();

    return NextResponse.json({
      valid: true,
      alreadyCheckedIn: false,
      ticketId: registrant.ticketId,
      firstname: registrant.firstname,
      lastname: registrant.lastname,
      checkedInAt: registrant.checkedInAt,
    });
  } catch (error) {
    console.error("Verify POST error:", error);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
