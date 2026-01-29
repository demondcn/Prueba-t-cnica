/**
 * CAPA DE ACCESO A DATOS (Data Access Layer)
 * Maneja la persistencia de datos usando SQLite
 */

import { Contact } from '@/lib/types/contact'
import db from './database'

interface ContactRow {
  id: string
  nombre: string
  email: string
  telefono: number
  ciudad: string
  notas: string | null
  created_at: string
}

export class ContactRepository {
  /**
   * Obtener todos los contactos
   */
  static getAll(): Contact[] {
    const rows = db.prepare(`
      SELECT id, nombre, email, telefono, ciudad, notas, created_at 
      FROM contacts 
      ORDER BY created_at DESC
    `).all() as ContactRow[]

    return rows.map(this.mapRowToContact)
  }

  /**
   * Obtener un contacto por ID
   */
  static getById(id: string): Contact | undefined {
    const row = db.prepare(`
      SELECT id, nombre, email, telefono, ciudad, notas, created_at 
      FROM contacts 
      WHERE id = ?
    `).get(id) as ContactRow | undefined

    return row ? this.mapRowToContact(row) : undefined
  }

  /**
   * Buscar contactos por término
   */
  static search(term: string): Contact[] {
    const searchTerm = `%${term}%`
    const rows = db.prepare(`
      SELECT id, nombre, email, telefono, ciudad, notas, created_at 
      FROM contacts 
      WHERE nombre LIKE ? OR email LIKE ? OR ciudad LIKE ?
      ORDER BY created_at DESC
    `).all(searchTerm, searchTerm, searchTerm) as ContactRow[]

    return rows.map(this.mapRowToContact)
  }

  /**
   * Crear un nuevo contacto
   */
  static create(data: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    db.prepare(`
      INSERT INTO contacts (id, nombre, email, telefono, ciudad, notas, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.nombre, data.email, data.telefono, data.ciudad, data.notas || null, createdAt)

    return {
      id,
      ...data,
      createdAt
    }
  }

  /**
   * Eliminar un contacto
   */
  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(id)
    return result.changes > 0
  }

  /**
   * Verificar si existe un email
   */
  static emailExists(email: string, excludeId?: string): boolean {
    const query = excludeId
      ? 'SELECT COUNT(*) as count FROM contacts WHERE LOWER(email) = LOWER(?) AND id != ?'
      : 'SELECT COUNT(*) as count FROM contacts WHERE LOWER(email) = LOWER(?)'
    
    const params = excludeId ? [email, excludeId] : [email]
    const result = db.prepare(query).get(...params) as { count: number }
    
    return result.count > 0
  }

  /**
   * Mapear fila de BD a objeto Contact
   */
  private static mapRowToContact(row: ContactRow): Contact {
    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      telefono: row.telefono,
      ciudad: row.ciudad,
      notas: row.notas || undefined,
      createdAt: row.created_at
    }
  }
}
