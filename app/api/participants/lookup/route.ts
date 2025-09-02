import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, birthDate, eventId } = body;

    if (!email || !birthDate || !eventId) {
      return NextResponse.json({ error: "Email, birthDate, dan eventId wajib diisi" }, { status: 400 });
    }

    const participant = await prisma.participant.findFirst({
      where: {
        email,
        birthDate: new Date(birthDate),
        eventId: Number(eventId),
      },
      include: {
        event: { select: { name: true } },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        fullName: participant.fullName,
        email: participant.email,
        ticketCode: participant.ticketCode,
        event: participant.event.name,
      },
    });
  } catch (err) {
    console.error("Lookup error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
