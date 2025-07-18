// src/app/api/test-db/route.ts
import { db } from '../../../lib/mysql'

export async function GET() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado')
    return Response.json({ success: true, resultado: (rows as any)[0].resultado })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
