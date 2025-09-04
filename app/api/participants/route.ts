import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, birthDate, eventId } = body;

    if (!fullName || !email || !birthDate || !eventId) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // search event by id
    const dbEvent = await prisma.event.findUnique({ where: { id: Number(eventId) } });
    if (!dbEvent) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    // check apakah participant terdaftar dengan email dan eventId yang sama
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        email,
        eventId: Number(eventId),
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        {
          error: "Email ini sudah terdaftar di event ini",
          participant: existingParticipant,
        },
        { status: 400 }
      );
    }

    // create participant baru
    const participant = await prisma.participant.create({
      data: {
        fullName,
        email,
        birthDate: new Date(birthDate),
        eventId: dbEvent.id,
        ticketCode: randomUUID(),
      },
    });

    return NextResponse.json({ participant });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}
