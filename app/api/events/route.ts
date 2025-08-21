import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { category: true },
    });
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data event" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, date, location, quota, categoryId, description } = body;

    if (!name || !date || !location || !quota || !categoryId) {
      return NextResponse.json({ error: "Field wajib diisi" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        quota: Number(quota),
        participantCount: 0,
        categoryId: Number(categoryId),
        description: description || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(newEvent);
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
  }
}
