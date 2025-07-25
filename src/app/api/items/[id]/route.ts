import { NextResponse } from "next/server";
import { db } from "../../../../lib/mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface ItemSeccion extends RowDataPacket {
  id: number;
  seccion_id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  imagen_url: string;
  archivo_pdf: string | null;
  es_destacado: boolean;
}

export async function DELETE(request: Request) {
  try {
    // Extraer ID desde la URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const [existingItem] = await db.query<any[]>(
      "SELECT seccion_id FROM items_seccion WHERE id = ?",
      [itemId]
    );

    if (!existingItem || existingItem.length === 0) {
      return NextResponse.json(
        { success: false, error: "Item no encontrado" },
        { status: 404 }
      );
    }

    const seccionId = existingItem[0].seccion_id;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM items_seccion WHERE id = ?",
      [itemId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar el item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, seccion_id: seccionId });
  } catch (error) {
    console.error("Error en DELETE /api/items/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "ID no proporcionado" }, { status: 400 });
    }

    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const {
      seccion_id,
      nombre,
      descripcion,
      precio,
      imagen_url,
      archivo_pdf,
      es_destacado,
    } = body;

    if (!nombre || !seccion_id) {
      return NextResponse.json(
        { success: false, error: "Nombre y sección son campos requeridos" },
        { status: 400 }
      );
    }

    const [existingItem] = await db.query<ItemSeccion[]>(
      "SELECT id FROM items_seccion WHERE id = ?",
      [itemId]
    );

    if (!existingItem || existingItem.length === 0) {
      return NextResponse.json(
        { success: false, error: "Item no encontrado" },
        { status: 404 }
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE items_seccion SET 
        seccion_id = ?, 
        nombre = ?, 
        descripcion = ?, 
        precio = ?, 
        imagen_url = ?, 
        archivo_pdf = ?, 
        es_destacado = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        seccion_id,
        nombre,
        descripcion || null,
        precio !== null && precio !== '' ? Number(precio) : null,
        imagen_url || null,
        archivo_pdf || null,
        es_destacado ? 1 : 0,
        itemId,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "No se realizaron cambios en el item" },
        { status: 400 }
      );
    }

    const [updatedItem] = await db.query<ItemSeccion[]>(
      "SELECT * FROM items_seccion WHERE id = ?",
      [itemId]
    );

    return NextResponse.json({
      success: true,
      data: updatedItem[0],
    });

  } catch (error) {
    console.error("Error en PUT /api/items/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}