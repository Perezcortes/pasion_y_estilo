import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/mysql";

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
  id: number;
  nombre: string;
  rol: "ADMIN" | "BARBERO" | "CLIENTE";
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Token recibido:", token);

  if (!token) {
    console.log("No token found");
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log("Token decoded:", decoded);

    // Obtener datos completos del usuario desde la base de datos
    const [userData]: any = await db.query(
      `SELECT u.id, u.nombre, u.correo, u.rol, u.estado, u.creado_en
       FROM usuarios u
       WHERE u.id = ? AND u.estado = "ACTIVO"`,
      [decoded.id]
    );

    if (!userData || userData.length === 0) {
      console.log("Usuario no encontrado en la base de datos");
      return NextResponse.json({ user: null }, { status: 404 });
    }

    const userFromDB = userData[0];
    console.log("Usuario obtenido de DB:", userFromDB);

    // Combinar datos del token con datos de la DB
    const completeUser = {
      id: userFromDB.id,
      nombre: userFromDB.nombre,
      correo: userFromDB.correo,
      rol: userFromDB.rol,
      estado: userFromDB.estado,
      creado_en: userFromDB.creado_en,
    };

    return NextResponse.json(completeUser);
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
