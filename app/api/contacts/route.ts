/**
 * API ROUTES - Punto de entrada HTTP
 * Conecta la capa de presentación con la capa de negocio
 */

import { NextRequest, NextResponse } from 'next/server'
import { ContactService } from '@/lib/business/contact-service'
import { ContactFormData } from '@/lib/types/contact'

// GET - Consultar contactos
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')

  const result = search 
    ? ContactService.search(search)
    : ContactService.getAll()

  return NextResponse.json(result)
}

// POST - Insertar contacto
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const result = ContactService.create(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
