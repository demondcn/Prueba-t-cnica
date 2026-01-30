/**
 * API ROUTE - Eliminar contacto por ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { ContactService } from '@/lib/business/contact-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// DELETE - Eliminar contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = ContactService.delete(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
