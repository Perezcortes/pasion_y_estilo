// lib/mysql.ts
import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'passh',
  database: 'barber_db',
})
