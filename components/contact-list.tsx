'use client'

/**
 * CAPA DE PRESENTACIÓN - Lista de Contactos
 * Componente para consultar y eliminar contactos
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Contact } from '@/lib/types/contact'
import { Search, Trash2, Users, Loader2, AlertCircle, Mail, Phone, MapPin, FileText } from 'lucide-react'

interface ContactListProps {
  contacts: Contact[]
  isLoading: boolean
  onSearch: (term: string) => void
  onDelete: (id: string) => Promise<void>
  searchTerm: string
}

export function ContactList({ contacts, isLoading, onSearch, onDelete, searchTerm }: ContactListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm hover-lift transition-all duration-300">
      <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary/80 to-primary" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          Consultar Contactos
          {!isLoading && contacts.length > 0 && (
            <span className="ml-auto text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {contacts.length} registro{contacts.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          Busque y administre los contactos registrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar por nombre, email o ciudad..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-12 h-12 text-base bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Cargando contactos...</p>
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && contacts.length === 0 && (
          <Alert className="border-muted bg-muted/30 animate-scale-in">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-muted-foreground">
              {searchTerm 
                ? 'No se encontraron contactos con ese criterio de búsqueda' 
                : 'No hay contactos registrados. Agregue uno usando el formulario.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de contactos en cards */}
        {!isLoading && contacts.length > 0 && (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 stagger-children">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                className="group relative rounded-xl border bg-background/50 p-4 transition-all duration-300 hover:bg-background hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Nombre */}
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {contact.nombre}
                    </h3>
                    
                    {/* Info grid */}
                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{contact.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{contact.ciudad}</span>
                      </div>
                      {contact.notas && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{contact.notas}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        disabled={deletingId === contact.id}
                      >
                        {deletingId === contact.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-scale-in">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Está seguro de eliminar el contacto <strong className="text-foreground">{contact.nombre}</strong>? 
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="transition-all duration-200">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(contact.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Hover indicator */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
