import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
  id: number;
  nombre: string;
  rol: "ADMIN" | "BARBERO" | "CLIENTE";
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log('Token recibido:', token);

  if (!token) {
    console.log('No token found');
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('Token decoded:', decoded);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    console.error('JWT verification error:', err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
