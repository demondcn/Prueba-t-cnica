/**
 * CAPA DE REGLAS DE NEGOCIO (Business Logic Layer)
 * Contiene las validaciones y reglas de negocio
 */

import { Contact, ContactFormData, ValidationError, ApiResponse } from '@/lib/types/contact'
import { ContactRepository } from '@/lib/data/contact-repository'

export class ContactService {
  /**
   * Validar formato de email
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validar que sea un número válido
   */
  private static isValidPhone(phone: string): boolean {
    const phoneNumber = Number(phone)
    return !isNaN(phoneNumber) && phoneNumber > 0 && phone.length >= 7
  }

  /**
   * Validar los datos del formulario
   */
  static validate(data: ContactFormData): ValidationError[] {
    const errors: ValidationError[] = []

    // Validación de campo obligatorio: nombre
    if (!data.nombre || data.nombre.trim() === '') {
      errors.push({ field: 'nombre', message: 'El nombre es obligatorio' })
    } else if (data.nombre.trim().length < 2) {
      errors.push({ field: 'nombre', message: 'El nombre debe tener al menos 2 caracteres' })
    }

    // Validación de campo obligatorio + tipo email
    if (!data.email || data.email.trim() === '') {
      errors.push({ field: 'email', message: 'El email es obligatorio' })
    } else if (!this.isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'El formato del email no es válido' })
    }

    // Validación de campo obligatorio + tipo numérico
    if (!data.telefono || data.telefono.trim() === '') {
      errors.push({ field: 'telefono', message: 'El teléfono es obligatorio' })
    } else if (!this.isValidPhone(data.telefono)) {
      errors.push({ field: 'telefono', message: 'El teléfono debe ser un número válido (mínimo 7 dígitos)' })
    }

    // Validación de campo obligatorio: ciudad
    if (!data.ciudad || data.ciudad.trim() === '') {
      errors.push({ field: 'ciudad', message: 'La ciudad es obligatoria' })
    }

    // Campo notas es OPCIONAL - no se valida obligatoriedad

    return errors
  }

  /**
   * Crear un nuevo contacto con validaciones
   */
  static create(data: ContactFormData): ApiResponse<Contact> {
    // 1. Validar datos
    const errors = this.validate(data)
    if (errors.length > 0) {
      return { success: false, errors }
    }

    // 2. Regla de negocio: email único
    if (ContactRepository.emailExists(data.email)) {
      return { 
        success: false, 
        errors: [{ field: 'email', message: 'Este email ya está registrado' }] 
      }
    }

    // 3. Crear contacto
    const contact = ContactRepository.create({
      nombre: data.nombre.trim(),
      email: data.email.trim().toLowerCase(),
      telefono: Number(data.telefono),
      ciudad: data.ciudad.trim(),
      notas: data.notas?.trim() || undefined
    })

    return { success: true, data: contact }
  }

  /**
   * Obtener todos los contactos
   */
  static getAll(): ApiResponse<Contact[]> {
    const contacts = ContactRepository.getAll()
    return { success: true, data: contacts }
  }

  /**
   * Buscar contactos
   */
  static search(term: string): ApiResponse<Contact[]> {
    const contacts = term.trim() 
      ? ContactRepository.search(term) 
      : ContactRepository.getAll()
    return { success: true, data: contacts }
  }

  /**
   * Eliminar un contacto
   */
  static delete(id: string): ApiResponse<void> {
    const contact = ContactRepository.getById(id)
    
    if (!contact) {
      return { success: false, error: 'Contacto no encontrado' }
    }

    const deleted = ContactRepository.delete(id)
    
    if (!deleted) {
      return { success: false, error: 'No se pudo eliminar el contacto' }
    }

    return { success: true }
  }
}
