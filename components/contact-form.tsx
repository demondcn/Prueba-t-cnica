'use client'

import React from "react"

/**
 * CAPA DE PRESENTACIÓN - Formulario de Contacto
 * Componente para insertar nuevos contactos
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ContactFormData, ValidationError } from '@/lib/types/contact'
import { Loader2, UserPlus, CheckCircle, Mail, Phone, MapPin, FileText, User } from 'lucide-react'

interface ContactFormProps {
  onSuccess: () => void
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    notas: ''
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const getFieldError = (field: string) => {
    return errors.find(e => e.field === field)?.message
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo al modificar
    setErrors(prev => prev.filter(e => e.field !== field))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors([])
    setShowSuccess(false)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!result.success) {
        setErrors(result.errors || [{ field: 'general', message: result.error }])
      } else {
        // Limpiar formulario
        setFormData({ nombre: '', email: '', telefono: '', ciudad: '', notas: '' })
        setShowSuccess(true)
        onSuccess()
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch {
      setErrors([{ field: 'general', message: 'Error de conexión' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm hover-lift transition-all duration-300">
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          Insertar Contacto
        </CardTitle>
        <CardDescription className="text-sm">
          Complete los campos para registrar un nuevo contacto. Los campos marcados con <span className="text-primary font-medium">*</span> son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mensaje de éxito */}
          {showSuccess && (
            <Alert className="border-primary/30 bg-primary/5 text-primary animate-scale-in">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">Contacto registrado exitosamente</AlertDescription>
            </Alert>
          )}

          {/* Error general */}
          {getFieldError('general') && (
            <Alert variant="destructive" className="animate-scale-in">
              <AlertDescription>{getFieldError('general')}</AlertDescription>
            </Alert>
          )}

          {/* Nombre - Obligatorio */}
          <div className="space-y-2 group">
            <Label htmlFor="nombre" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Nombre <span className="text-primary">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Ingrese el nombre completo"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`transition-all duration-200 h-11 ${
                getFieldError('nombre') 
                  ? 'border-destructive focus:ring-destructive/20' 
                  : 'focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {getFieldError('nombre') && (
              <p className="text-sm text-destructive flex items-center gap-1 animate-scale-in">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {getFieldError('nombre')}
              </p>
            )}
          </div>

          {/* Email - Obligatorio + Validación tipo email */}
          <div className="space-y-2 group">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Email <span className="text-primary">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`transition-all duration-200 h-11 ${
                getFieldError('email') 
                  ? 'border-destructive focus:ring-destructive/20' 
                  : 'focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {getFieldError('email') && (
              <p className="text-sm text-destructive flex items-center gap-1 animate-scale-in">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Teléfono - Obligatorio + Validación numérica */}
          <div className="space-y-2 group">
            <Label htmlFor="telefono" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Teléfono <span className="text-primary">*</span>
            </Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className={`transition-all duration-200 h-11 ${
                getFieldError('telefono') 
                  ? 'border-destructive focus:ring-destructive/20' 
                  : 'focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {getFieldError('telefono') && (
              <p className="text-sm text-destructive flex items-center gap-1 animate-scale-in">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {getFieldError('telefono')}
              </p>
            )}
          </div>

          {/* Ciudad - Obligatorio */}
          <div className="space-y-2 group">
            <Label htmlFor="ciudad" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Ciudad <span className="text-primary">*</span>
            </Label>
            <Input
              id="ciudad"
              placeholder="Ingrese la ciudad"
              value={formData.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              className={`transition-all duration-200 h-11 ${
                getFieldError('ciudad') 
                  ? 'border-destructive focus:ring-destructive/20' 
                  : 'focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {getFieldError('ciudad') && (
              <p className="text-sm text-destructive flex items-center gap-1 animate-scale-in">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {getFieldError('ciudad')}
              </p>
            )}
          </div>

          {/* Notas - OPCIONAL */}
          <div className="space-y-2 group">
            <Label htmlFor="notas" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Notas <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="notas"
              placeholder="Información adicional..."
              value={formData.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              rows={3}
              className="transition-all duration-200 resize-none focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Insertar Contacto
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
