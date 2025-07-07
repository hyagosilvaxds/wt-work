import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para obter a URL de redirecionamento após login
export function getRedirectUrl(searchParams?: URLSearchParams): string {
  const from = searchParams?.get('from')
  
  // Se há um parâmetro 'from' válido, usar ele, senão usar o dashboard
  if (from && from !== '/login' && from !== '/register') {
    return from
  }
  
  return '/'
}
