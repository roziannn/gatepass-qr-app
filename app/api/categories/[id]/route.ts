import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID harus angka" }, { status: 400 });

  const category = await prisma.eventCategory.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });

  return NextResponse.json(category);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID harus angka" }, { status: 400 });

  const body = await req.json();
  const { name } = body;

  try {
    const updated = await prisma.eventCategory.update({ where: { id }, data: { name } });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID harus angka" }, { status: 400 });

  try {
    await prisma.eventCategory.delete({ where: { id } });
    return NextResponse.json({ message: "Kategori berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
