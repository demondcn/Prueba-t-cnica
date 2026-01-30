'use client'

/**
 * CAPA DE PRESENTACIÓN - Página Principal
 * Integra el formulario y la lista de contactos
 */

import { useCallback, useEffect, useState } from 'react'
import { ContactForm } from '@/components/contact-form'
import { ContactList } from '@/components/contact-list'
import { Contact } from '@/lib/types/contact'
import { Database, Layers, Sparkles, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar contactos
  const loadContacts = useCallback(async (search?: string) => {
    setIsLoading(true)
    try {
      const url = search 
        ? `/api/contacts?search=${encodeURIComponent(search)}`
        : '/api/contacts'
      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setContacts(result.data)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar contactos al inicio
  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  // Buscar contactos con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadContacts(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadContacts])

  // Eliminar contacto
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        setContacts(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b bg-background/80 backdrop-blur-md animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg animate-pulse-glow">
                <Database className="h-7 w-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Sistema de Gestión de Contactos
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Sparkles className="h-4 w-4 text-primary animate-float" />
                Arquitectura de tres capas con almacenamiento en memoria
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Feature badges */}
      <div className="container mx-auto px-4 py-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover-lift cursor-default">
            <Shield className="h-4 w-4" />
            Validación de datos
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover-lift cursor-default">
            <Zap className="h-4 w-4" />
            Base de datos simulada
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover-lift cursor-default">
            <Layers className="h-4 w-4" />
            Arquitectura 3 capas
          </div>
        </div>
      </div>

      {/* Información de arquitectura */}
      <div className="container mx-auto px-4 pb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-5 shadow-sm hover-lift">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-2 text-sm flex-1">
              <p className="font-semibold text-foreground">Estructura del Proyecto:</p>
              <div className="grid gap-2 md:grid-cols-3 stagger-children">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 transition-colors hover:bg-muted">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <code className="text-xs font-mono">/components</code>
                  <span className="text-xs text-muted-foreground ml-auto">Presentación</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 transition-colors hover:bg-muted">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <code className="text-xs font-mono">/lib/business</code>
                  <span className="text-xs text-muted-foreground ml-auto">Negocio</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 transition-colors hover:bg-muted">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <code className="text-xs font-mono">/lib/data</code>
                  <span className="text-xs text-muted-foreground ml-auto">Datos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario de inserción */}
          <div className="animate-slide-in-left">
            <ContactForm onSuccess={() => loadContacts(searchTerm)} />
          </div>

          {/* Lista de consulta y eliminación */}
          <div className="animate-slide-in-right">
            <ContactList
              contacts={contacts}
              isLoading={isLoading}
              onSearch={setSearchTerm}
              onDelete={handleDelete}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* Footer con validaciones */}
      <footer className="relative border-t bg-card/50 backdrop-blur-sm mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-semibold mb-4 text-foreground">Validaciones implementadas:</p>
            <div className="flex flex-wrap justify-center gap-3 stagger-children">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm border border-primary/20 hover-lift cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Email (formato válido)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm border border-primary/20 hover-lift cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                Teléfono (numérico)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm border border-primary/20 hover-lift cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                Campos obligatorios (*)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 text-sm border border-primary/20 hover-lift cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
                Campo opcional (Notas)
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
