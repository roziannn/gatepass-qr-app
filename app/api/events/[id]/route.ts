import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// GET by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("GET event error:", err);
    return NextResponse.json({ error: "Gagal mengambil data event" }, { status: 500 });
  }
}

// PUT (Update)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, date, location, quota, status, categoryId } = body;

    // Cek apakah event ada
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        date: date ? new Date(date) : undefined, // pastikan format DateTime valid
        location,
        quota,
        status,
        categoryId,
      },
      include: { category: true }, // supaya category ikut di-return
    });

    return NextResponse.json(updatedEvent);
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Gagal update event" }, { status: 500 });
  }
}
