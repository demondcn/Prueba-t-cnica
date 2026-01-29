/**
 * CAPA DE ACCESO A DATOS - Configuración SQLite
 * Base de datos SQLite usando better-sqlite3
 */

import Database from 'better-sqlite3'
import path from 'path'

// Crear conexión a la base de datos
const dbPath = path.join(process.cwd(), 'contacts.db')
const db = new Database(dbPath)

// Habilitar modo WAL para mejor rendimiento
db.pragma('journal_mode = WAL')

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono INTEGER NOT NULL,
    ciudad TEXT NOT NULL,
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// Insertar datos de ejemplo si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as count FROM contacts').get() as { count: number }
if (count.count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO contacts (id, nombre, email, telefono, ciudad, notas, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `)
  
  insertStmt.run(crypto.randomUUID(), 'Juan Pérez', 'juan.perez@email.com', 3001234567, 'Bogotá', 'Cliente preferencial')
  insertStmt.run(crypto.randomUUID(), 'María García', 'maria.garcia@email.com', 3109876543, 'Medellín', null)
}

export default db
