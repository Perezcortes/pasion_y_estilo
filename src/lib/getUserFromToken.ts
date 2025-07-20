import jwt_decode from 'jwt-decode';

interface TokenPayload {
  id: number;
  nombre: string;
  rol: string;
}

export function getUserFromToken(): TokenPayload | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwt_decode(token) as TokenPayload;
    return decoded;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
}
