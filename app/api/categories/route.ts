import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.eventCategory.findMany();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil kategori" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const newCategory = await prisma.eventCategory.create({ data: { name } });
    return NextResponse.json(newCategory);
  } catch {
    return NextResponse.json({ error: "Gagal membuat kategori" }, { status: 500 });
  }
}
