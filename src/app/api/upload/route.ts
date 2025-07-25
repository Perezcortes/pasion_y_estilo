import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Guardar el archivo en el sistema (en producción usa un servicio como S3)
  const path = join(process.cwd(), 'public/uploads', file.name)
  await writeFile(path, buffer)

  return NextResponse.json({
    url: `/uploads/${file.name}`
  })
}