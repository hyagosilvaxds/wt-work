"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  User,
  Building,
  Calendar,
  DollarSign,
  Download,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Paperclip
} from "lucide-react"

interface Training {
  id: string
  name: string
  price: number
  totalPrice?: number
}

interface Budget {
  id: string
  budgetNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  companyName: string
  trainings: Training[]
  totalValue: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
  notes?: string
  attachments?: string[]
}

interface BudgetDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  budget: Budget | null
  onStatusChange: (budgetId: string, newStatus: Budget['status']) => void
}

export function BudgetDetailsModal({ isOpen, onClose, budget, onStatusChange }: BudgetDetailsModalProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  // Debug: log trainings when budget is present (render-time log avoids extra Hooks)
  if (budget) {
    console.log('[BudgetDetailsModal] trainings data:', budget.trainings)
  }

  if (!budget) return null

  const getStatusBadge = (status: Budget['status']) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      approved: { label: "Aprovado", variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      rejected: { label: "Rejeitado", variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      expired: { label: "Vencido", variant: "outline" as const, icon: AlertCircle, color: "text-gray-600" }
    }

    const config = statusConfig[status] ?? {
      label: String(status || 'Desconhecido'),
      variant: 'secondary' as const,
      icon: AlertCircle,
      color: 'text-gray-600'
    }
    const Icon = config.icon || AlertCircle

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleStatusChange = (newStatus: Budget['status']) => {
    onStatusChange(budget.id, newStatus)
    setIsChangingStatus(false)
  }

  const handleDownloadPDF = () => {
    // Gerar HTML do orçamento
    const html = generateBudgetHTML(budget)

    // Criar blob e fazer download
    const blob = new Blob([html], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `orcamento-${budget.budgetNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }

  const generateBudgetHTML = (budget: Budget): string => {
    const statusMap = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      expired: 'Vencido'
    }

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orçamento ${budget.budgetNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .section-title { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .trainings-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .trainings-table th, .trainings-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .trainings-table th { background-color: #f9fafb; font-weight: bold; }
        .total-row { font-weight: bold; background-color: #f3f4f6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Work Treinamentos</div>
        <div>Orçamento ${budget.budgetNumber}</div>
        <div>Status: ${statusMap[budget.status]}</div>
    </div>

    <div class="section">
        <div class="section-title">Informações do Cliente</div>
        <div class="info-grid">
            <div><strong>Nome:</strong> ${budget.clientName}</div>
            <div><strong>E-mail:</strong> ${budget.clientEmail}</div>
            <div><strong>Empresa:</strong> ${budget.companyName}</div>
            <div><strong>Telefone:</strong> ${budget.clientPhone || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Treinamentos</div>
        <table class="trainings-table">
            <thead>
                <tr><th>Treinamento</th><th style="text-align: right;">Valor</th></tr>
            </thead>
            <tbody>
                ${budget.trainings.map(training => `
                    <tr>
                        <td>${training.name}</td>
                        <td style="text-align: right;">R$ ${training.price.toFixed(2).replace('.', ',')}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td><strong>Total</strong></td>
                    <td style="text-align: right;"><strong>R$ ${budget.totalValue.toFixed(2).replace('.', ',')}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    ${budget.notes ? `
    <div class="section">
        <div class="section-title">Observações</div>
        <div>${budget.notes}</div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Work Treinamentos - Documento gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p>Este orçamento é válido até ${new Date(budget.expiresAt).toLocaleDateString('pt-BR')}</p>
    </div>
</body>
</html>
    `
  }

  const isExpired = new Date(budget.expiresAt) < new Date()
  const daysToExpire = Math.ceil((new Date(budget.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Orçamento - {budget.budgetNumber}
          </DialogTitle>
          <DialogDescription>
            Visualize todas as informações do orçamento e gerencie o status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com Status e Ações */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Status atual</p>
                {getStatusBadge(budget.status)}
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-gray-600">Valor total</p>
                <p className="text-xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(budget.totalValue)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsChangingStatus(!isChangingStatus)}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Alterar Status
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Alterar Status */}
          {isChangingStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Alterar Status do Orçamento</CardTitle>
                <CardDescription>
                  Selecione o novo status para este orçamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant={budget.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('pending')}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Pendente
                  </Button>
                  <Button
                    variant={budget.status === 'approved' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('approved')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprovado
                  </Button>
                  <Button
                    variant={budget.status === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => handleStatusChange('rejected')}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeitado
                  </Button>
                  <Button
                    variant={budget.status === 'expired' ? 'secondary' : 'outline'}
                    onClick={() => handleStatusChange('expired')}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Vencido
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome</p>
                    <p className="text-lg">{budget.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">E-mail</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p>{budget.clientEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Empresa</p>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <p>{budget.companyName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p>{budget.clientPhone || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Orçamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informações do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Criação</p>
                  <p className="text-lg">{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Expiração</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg ${isExpired ? 'text-red-600' : daysToExpire <= 7 ? 'text-yellow-600' : ''}`}>
                      {new Date(budget.expiresAt).toLocaleDateString('pt-BR')}
                    </p>
                    {isExpired && <Badge variant="destructive">Vencido</Badge>}
                    {!isExpired && daysToExpire <= 7 && (
                      <Badge variant="secondary">
                        {daysToExpire} dia{daysToExpire !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Número do Orçamento</p>
                  <p className="text-lg font-mono">{budget.budgetNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treinamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Treinamentos Incluídos
              </CardTitle>
              <CardDescription>
                Lista de treinamentos e valores do orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Treinamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.name}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format((training.totalPrice ?? training.price))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(budget.totalValue)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Anexos */}
          {budget.attachments && budget.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Anexos
                </CardTitle>
                <CardDescription>
                  Documentos anexados pelo cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {budget.attachments.map((filename, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{filename}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {budget.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{budget.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}