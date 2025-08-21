import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = Number(params.id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "ID event tidak valid" }, { status: 400 });
    }

    const participants = await prisma.participant.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        ticketCode: true,
        scanDate: true,
        createdAt: true,
      },
    });

    // Format tanggal terdaftar
    const formatted = participants.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      email: p.email,
      status: p.status,
      ticketCode: p.ticketCode,
      scanDate: p.scanDate,
      registeredAt: new Date(p.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengambil participants" }, { status: 500 });
  }
}
