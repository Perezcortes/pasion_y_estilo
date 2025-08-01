import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number
      rol: string
    }
    return decoded
  } catch (err) {
    console.error('[AUTH_ERROR]', err)
    return null
  }
}
