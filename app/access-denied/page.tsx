"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Apenas administradores e instrutores têm acesso a este sistema.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Se você é um administrador ou instrutor, verifique suas credenciais e tente novamente.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/login')}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = 'mailto:suporte@wtwork.com.br'}
              >
                <Mail className="w-4 h-4 mr-2" />
                Solicitar Acesso
              </Button>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              © 2025 WT Work Treinamentos. Todos os direitos reservados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
