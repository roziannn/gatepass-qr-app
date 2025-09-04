import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { ticketCode } = await req.json();

    if (!ticketCode) {
      return NextResponse.json({ error: "Ticket code wajib diisi" }, { status: 400 });
    }

    // get participant beserta event
    const participant = await prisma.participant.findUnique({
      where: { ticketCode },
      include: { event: true },
    });

    if (!participant) {
      return NextResponse.json({ success: false, message: "Ticket tidak ditemukan" }, { status: 404 });
    }

    // if sudah discan sebelumnya
    if (participant.scanDate) {
      return NextResponse.json({
        success: true,
        message: "Sudah check-in",
        data: {
          id: participant.id,
          fullName: participant.fullName,
          email: participant.email,
          ticketCode: participant.ticketCode,
          eventName: participant.event?.name ?? null,
          scanDate: participant.scanDate?.toISOString() ?? null,
          status: participant.status,
          checkedIn: true,
          justCheckedIn: false,
        },
      });
    }

    // update scanDate dan status jika tiket baru
    const updatedParticipant = await prisma.participant.update({
      where: { ticketCode },
      data: {
        scanDate: new Date(),
        status: "ATTENDED",
      },
      include: { event: true },
    });

    return NextResponse.json({
      success: true,
      message: "Ticket berhasil check-in",
      data: {
        id: updatedParticipant.id,
        fullName: updatedParticipant.fullName,
        email: updatedParticipant.email,
        ticketCode: updatedParticipant.ticketCode,
        eventName: updatedParticipant.event?.name ?? null,
        scanDate: updatedParticipant.scanDate?.toISOString() ?? null,
        status: updatedParticipant.status,
        checkedIn: true,
        justCheckedIn: true,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal memeriksa tiket" }, { status: 500 });
  }
}
