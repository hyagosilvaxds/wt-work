"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Phone, Building } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    if (!formData.acceptTerms) {
      alert("Você deve aceitar os termos de uso!")
      return
    }

    setIsLoading(true)
    
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aqui você faria o registro real
    console.log("Register attempt:", formData)
    
    // Redirecionar para o dashboard após registro bem-sucedido
    router.push('/')
    
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
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
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="glass backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Criar sua conta
            </CardTitle>
            <CardDescription className="text-gray-600">
              Cadastre-se para acessar o sistema de gerenciamento de treinamentos
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
                      required
                    />
                  </div>
                </div>

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
                      className="pl-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                    Empresa (opcional)
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Nome da empresa"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
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
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                    Eu aceito os{" "}
                    <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                      termos de uso
                    </Link>{" "}
                    e a{" "}
                    <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                      política de privacidade
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    name="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, acceptMarketing: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="acceptMarketing" className="text-sm text-gray-600 leading-relaxed">
                    Quero receber novidades e ofertas por email
                  </Label>
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
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Criar conta</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Faça login
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 WT Work Treinamentos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
