/**
 * API ROUTE - Eliminar contacto por ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { ContactService } from '@/lib/business/contact-service'

// DELETE - Eliminar contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = ContactService.delete(id)

  if (!result.success) {
    return NextResponse.json(result, { status: 404 })
  }

  return NextResponse.json(result)
}
