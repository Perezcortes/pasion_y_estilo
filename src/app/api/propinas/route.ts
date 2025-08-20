import { NextResponse } from "next/server";
import { db } from "../../../lib/mysql";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  try {
    // Consulta para obtener todas las propinas con información del barbero
    const [propinas]: any = await db.query(`
  SELECT 
    p.id,
    p.barbero_id,
    p.nombre_cliente,
    p.email_cliente,
    p.monto,
    p.mensaje,
    p.calificacion,
    p.fecha_creacion,
    u.nombre as barbero_nombre
  FROM propinas p
  JOIN barberos b ON p.barbero_id = b.id
  JOIN usuarios u ON b.id_usuario = u.id
  ORDER BY p.fecha_creacion DESC
  LIMIT 20
`);

    return new NextResponse(JSON.stringify(propinas), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[ERROR_GET_PROPINAS]", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al obtener propinas" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const body = await req.json();
    const {
      barbero_id,
      monto,
      mensaje,
      calificacion,
      metodo_pago,
      referencia_pago,
    } = body;

    // Validar campos obligatorios
    if (!barbero_id || !monto || !calificacion) {
      return new NextResponse(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Necesitamos obtener el nombre del usuario de otra manera
    // Ya que el objeto user solo tiene id, rol y correo
    const [userData]: any = await db.query(
      "SELECT nombre FROM usuarios WHERE id = ?",
      [user.id]
    );

    const nombreCliente = userData[0]?.nombre || "Cliente";

    // Insertar la propina en la base de datos
    const [result]: any = await db.query(
      `INSERT INTO propinas 
       (barbero_id, nombre_cliente, email_cliente, monto, mensaje, calificacion, metodo_pago, referencia_pago) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        barbero_id,
        nombreCliente,
        user.correo,
        monto,
        mensaje || null,
        calificacion,
        metodo_pago,
        referencia_pago || null,
      ]
    );

    // Obtener la propina recién creada con información del barbero
    const [propina]: any = await db.query(
      `
      SELECT 
        p.id,
        p.barbero_id,
        p.nombre_cliente,
        p.email_cliente,
        p.monto,
        p.mensaje,
        p.calificacion,
        p.fecha_creacion,
        u.nombre as barbero_nombre
      FROM propinas p
      JOIN barberos b ON p.barbero_id = b.id
      JOIN usuarios u ON b.id_usuario = u.id
      WHERE p.id = ?
    `,
      [result.insertId]
    );

    return new NextResponse(JSON.stringify(propina[0]), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[ERROR_POST_PROPINA]", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al crear propina" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
