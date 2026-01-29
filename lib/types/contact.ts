// Tipos para la entidad Contacto
export interface Contact {
  id: string
  nombre: string        // Obligatorio
  email: string         // Obligatorio - validación email
  telefono: number      // Obligatorio - validación numérico
  ciudad: string        // Obligatorio
  notas?: string        // Opcional
  createdAt: string
}

export interface ContactFormData {
  nombre: string
  email: string
  telefono: string
  ciudad: string
  notas?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: ValidationError[]
}
