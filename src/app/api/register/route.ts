import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Registrant, MAX_REGISTRANTS } from "@/models/Registrant";

export const runtime = "nodejs";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstname = clean(body.firstname);
    const lastname = clean(body.lastname);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone).replace(/\s+/g, "");

    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 }
      );
    }

    if (phone.length < 7) {
      return NextResponse.json(
        { error: "Enter a valid phone number" },
        { status: 400 }
      );
    }

    await connectDB();

    const count = await Registrant.countDocuments();
    if (count >= MAX_REGISTRANTS) {
      return NextResponse.json(
        { error: "Registration is full. All 50 spaces are taken." },
        { status: 403 }
      );
    }

    const ticketId = randomUUID();

    const registrant = await Registrant.create({
      ticketId,
      firstname,
      lastname,
      email,
      phone,
    });

    return NextResponse.json(
      {
        ticketId: registrant.ticketId,
        firstname: registrant.firstname,
        lastname: registrant.lastname,
        email: registrant.email,
        phone: registrant.phone,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const mongoError = error as { code?: number; keyPattern?: Record<string, number> };

    if (mongoError?.code === 11000) {
      const field = mongoError.keyPattern?.email
        ? "email"
        : mongoError.keyPattern?.phone
          ? "phone"
          : "details";
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 409 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
