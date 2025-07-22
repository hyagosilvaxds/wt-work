"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, CreditCard, Shield, User, Calendar, FileText, FileImage, MapPin } from "lucide-react"
import { getTechnicalResponsibleById, type TechnicalResponsible } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface TechnicalResponsibleDetailsModalProps {
  technicalResponsibleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TechnicalResponsibleDetailsModal({ 
  technicalResponsibleId, 
  open, 
  onOpenChange 
}: TechnicalResponsibleDetailsModalProps) {
  const [technicalResponsible, setTechnicalResponsible] = useState<TechnicalResponsible | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && technicalResponsibleId) {
      fetchTechnicalResponsible()
    }
  }, [open, technicalResponsibleId])

  const fetchTechnicalResponsible = async () => {
    try {
      setLoading(true)
      const data = await getTechnicalResponsibleById(technicalResponsibleId)
      setTechnicalResponsible(data)
    } catch (error) {
      console.error('Erro ao buscar responsável técnico:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do responsável técnico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!technicalResponsible) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Responsável Técnico
          </DialogTitle>
          <DialogDescription>
            Informações completas do responsável técnico cadastrado no sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com nome e status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{technicalResponsible.name}</h3>
              <p className="text-gray-600 font-medium">{technicalResponsible.profession}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${technicalResponsible.isActive 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
                } font-medium`}
              >
                {technicalResponsible.isActive ? "Ativo" : "Inativo"}
              </Badge>
              {technicalResponsible.signaturePath && (
                <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700 font-medium">
                  Com Assinatura
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações Pessoais */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{technicalResponsible.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium">{formatCPF(technicalResponsible.cpf)}</p>
                </div>
              </div>

              {technicalResponsible.rg && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <CreditCard className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RG</p>
                    <p className="font-medium">{technicalResponsible.rg}</p>
                  </div>
                </div>
              )}

              {technicalResponsible.professionalRegistry && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registro Profissional</p>
                    <p className="font-medium">{technicalResponsible.professionalRegistry}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contatos */}
          {(technicalResponsible.phone || technicalResponsible.mobilePhone) && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contatos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalResponsible.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefone Fixo</p>
                        <p className="font-medium">{formatPhone(technicalResponsible.phone)}</p>
                      </div>
                    </div>
                  )}

                  {technicalResponsible.mobilePhone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefone Celular</p>
                        <p className="font-medium">{formatPhone(technicalResponsible.mobilePhone)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Assinatura */}
          {technicalResponsible.signaturePath && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Assinatura Digital
                </h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FileImage className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Arquivo de Assinatura</p>
                    <p className="font-medium">Assinatura digital cadastrada</p>
                    <p className="text-xs text-gray-500">{technicalResponsible.signaturePath}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Observações */}
          {technicalResponsible.observations && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{technicalResponsible.observations}</p>
                </div>
              </div>
            </>
          )}

          {/* Informações do Sistema */}
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informações do Sistema
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data de Cadastro</p>
                  <p className="font-medium">{formatDate(technicalResponsible.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Atualização</p>
                  <p className="font-medium">{formatDate(technicalResponsible.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
