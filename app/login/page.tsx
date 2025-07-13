"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { login } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getRedirectUrl } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasError(false)
    
    try {
      const success = await login({
        email: formData.email,
        password: formData.password
      })
      
      if (success) {
        // Atualizar o contexto de autenticação
        authLogin()
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para o dashboard.",
          variant: "default",
        })
        
        // Obter URL de redirecionamento baseada no parâmetro 'from'
        const redirectUrl = getRedirectUrl(searchParams)
        
        // Aguardar um pouco para o toast aparecer antes de redirecionar
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
      }
    } catch (error) {
      console.error("Erro no login:", error)
      
      // Marcar que houve erro e resetar o loading
      setHasError(true)
      setIsLoading(false)
      
      // Mostrar toast imediatamente
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Credenciais inválidas. Verifique seu email e senha.",
        variant: "destructive",
      })
      
      // Não resetar o formulário em caso de erro
      return
    }
    
    // Só resetar o loading se chegou até aqui (sucesso)
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    // Limpar o estado de erro quando o usuário começar a digitar
    if (hasError) {
      setHasError(false)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="glass backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-6">
              
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Faça login para acessar o sistema de gerenciamento de treinamentos
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 ${
                      hasError ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 ${
                      hasError ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  
                 
                </div>
                
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 btn-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              
            </div>

            
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 WT Work Treinamentos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
