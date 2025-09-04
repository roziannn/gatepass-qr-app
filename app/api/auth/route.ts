import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    if (email !== "admin@example.com" || password !== "admin123") {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // bikin JWT
    const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime("1h").sign(JWT_SECRET);

    const res = NextResponse.json({ message: "Login berhasil" });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 3600 });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
