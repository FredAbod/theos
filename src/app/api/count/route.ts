import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registrant, MAX_REGISTRANTS } from "@/models/Registrant";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const count = await Registrant.countDocuments();
    return NextResponse.json({
      count,
      max: MAX_REGISTRANTS,
      remaining: Math.max(0, MAX_REGISTRANTS - count),
      full: count >= MAX_REGISTRANTS,
    });
  } catch (error) {
    console.error("Count error:", error);
    return NextResponse.json(
      { error: "Unable to check availability" },
      { status: 500 }
    );
  }
}
