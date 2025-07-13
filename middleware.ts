import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Definir as rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password']

// Definir as rotas protegidas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Obter o token JWT do cookie
  const token = request.cookies.get('jwtToken')?.value
  
  // Se não há token e é uma rota protegida, redirecionar para login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    // Adicionar a URL de retorno como parâmetro para redirecionar após login
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Se há token, verificar se é válido
  if (token) {
    try {
      const decoded = jwtDecode<any>(token)
      const currentTime = Date.now() / 1000
      
      // Verificar se o token expirou
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expirado, remover cookie e redirecionar para login se estiver em rota protegida
        const response = isProtectedRoute 
          ? NextResponse.redirect(new URL('/login', request.url))
          : NextResponse.next()
        
        // Remover o cookie expirado
        response.cookies.delete('jwtToken')
        response.cookies.delete('user')
        response.cookies.delete('userId')
        
        return response
      }
      
      // Se o usuário está logado e tenta acessar uma rota pública (exceto logout), redirecionar para dashboard
      if (isPublicRoute && !pathname.includes('/logout')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
    } catch (error) {
      // Token inválido, remover cookie e redirecionar para login se estiver em rota protegida
      console.error('Token JWT inválido:', error)
      
      const response = isProtectedRoute 
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next()
      
      // Remover cookies inválidos
      response.cookies.delete('jwtToken')
      response.cookies.delete('user')
      response.cookies.delete('userId')
      
      return response
    }
  }
  
  // Permitir acesso a rotas públicas sem token
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Permitir acesso a outras rotas (assets, api, etc.)
  return NextResponse.next()
}

// Configurar em quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]*$).*)',
  ],
}
