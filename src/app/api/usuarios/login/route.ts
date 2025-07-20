import { db } from "../../../../lib/mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json();

    if (!correo || !password) {
      return NextResponse.json(
        { success: false, error: "Faltan datos" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND estado = "ACTIVO"',
      [correo]
    );
    const usuarios = rows as any[];

    if (usuarios.length === 0) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const usuario = usuarios[0];

    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    const response = NextResponse.json({ success: true });

    // Aquí se establece la cookie usando NextResponse
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 4,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
