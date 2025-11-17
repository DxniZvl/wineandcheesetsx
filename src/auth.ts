// src/auth.ts
export type WineUser = {
  id: number
  nombre: string
  apellido: string
  email: string
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

export function isAdmin(user: WineUser | null) {
  return !!user && user.email === 'admin@wine.com'
}
