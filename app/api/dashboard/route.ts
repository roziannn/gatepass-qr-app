import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const today = new Date();

    // 3 upcoming events berdasarkan tanggal terdekat, + count peserta
    const upcomingEvents = await prisma.event.findMany({
      where: { date: { gte: today } },
      include: {
        category: true,
        _count: { select: { participants: true } },
      },
      orderBy: { date: "asc" },
      take: 3,
    });

    // Statistik card
    const totalEvents = await prisma.event.count();
    const totalParticipants = await prisma.participant.count();
    const checkInToday = await prisma.participant.count({
      where: {
        scanDate: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });
    const ticketsSold = await prisma.participant.count();

    // Statistik chart per bulan
    const eventPerMonth = await prisma.event.groupBy({
      by: ["date"],
      _count: { id: true },
    });

    const participantsPerMonth = await prisma.participant.groupBy({
      by: ["createdAt"],
      _count: { id: true },
    });

    const barChartData = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(0, i).toLocaleString("id-ID", { month: "short" });
      const events = eventPerMonth.filter((e) => new Date(e.date).getMonth() === i).reduce((acc, curr) => acc + curr._count.id, 0);
      return { month: monthName, events };
    });

    const participantsChartData = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(0, i).toLocaleString("id-ID", { month: "short" });
      const participants = participantsPerMonth.filter((p) => new Date(p.createdAt).getMonth() === i).reduce((acc, curr) => acc + curr._count.id, 0);
      return { month: monthName, participants };
    });

    return NextResponse.json({
      upcomingEvents,
      stats: {
        totalEvents,
        totalParticipants,
        checkInToday,
        ticketsSold,
      },
      chartData: { barChartData, participantsChartData },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
