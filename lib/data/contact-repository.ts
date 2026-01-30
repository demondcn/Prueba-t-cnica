/**
 * CAPA DE ACCESO A DATOS (Data Access Layer)
 * Simula una base de datos en memoria para demostración
 * En producción, se reemplazaría por conexión a SQLite, PostgreSQL, etc.
 */

import { Contact } from "@/lib/types/contact";

// Simulación de base de datos en memoria
const contactsDB = new Map<string, Contact>();

// Datos de ejemplo iniciales
const sampleContacts: Omit<Contact, "id" | "createdAt">[] = [
  {
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: 3001234567,
    ciudad: "Bogotá",
    notas: "Cliente preferencial",
  },
  {
    nombre: "María García",
    email: "maria.garcia@email.com",
    telefono: 3109876543,
    ciudad: "Medellín",
    notas: undefined,
  },
  {
    nombre: "Carlos López",
    email: "carlos.lopez@email.com",
    telefono: 3205551234,
    ciudad: "Cali",
    notas: "Contacto de ventas",
  },
];

// Inicializar con datos de ejemplo
function initializeDB() {
  if (contactsDB.size === 0) {
    sampleContacts.forEach((contact) => {
      const id = crypto.randomUUID();
      contactsDB.set(id, {
        id,
        ...contact,
        createdAt: new Date().toISOString(),
      });
    });
  }
}

// Inicializar al cargar el módulo
initializeDB();

export class ContactRepository {
  /**
   * Obtener todos los contactos
   */
  static getAll(): Contact[] {
    initializeDB();
    return Array.from(contactsDB.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Obtener un contacto por ID
   */
  static getById(id: string): Contact | undefined {
    return contactsDB.get(id);
  }

  /**
   * Buscar contactos por término
   */
  static search(term: string): Contact[] {
    const searchTerm = term.toLowerCase();
    return this.getAll().filter(
      (contact) =>
        contact.nombre.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.ciudad.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Crear un nuevo contacto
   */
  static create(data: Omit<Contact, "id" | "createdAt">): Contact {
    const id = crypto.randomUUID();
    const contact: Contact = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    contactsDB.set(id, contact);
    return contact;
  }

  /**
   * Eliminar un contacto
   */
  static delete(id: string): boolean {
    return contactsDB.delete(id);
  }

  /**
   * Verificar si existe un email
   */
  static emailExists(email: string, excludeId?: string): boolean {
    const normalizedEmail = email.toLowerCase();
    for (const contact of contactsDB.values()) {
      if (
        contact.email.toLowerCase() === normalizedEmail &&
        contact.id !== excludeId
      ) {
        return true;
      }
    }
    return false;
  }
}
