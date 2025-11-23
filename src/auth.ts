// src/auth.ts
export type WineUser = {
  id: number
  nombre: string
  apellido: string
  email: string
  role?: 'admin' | 'user'
  canEdit?: boolean
}

const STORAGE_KEY = 'wine_user'

export function getCurrentUser(): WineUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WineUser
  } catch {
    return null
  }
}

export function setCurrentUser(user: WineUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Verifica si el usuario tiene rol de administrador
 */
export function isAdmin(user: WineUser | null): boolean {
  return !!user && user.role === 'admin'
}

/**
 * Verifica si el usuario tiene permisos de edición
 * Los admins siempre tienen permiso de edición
 */
export function canEdit(user: WineUser | null): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  return !!user.canEdit
}
