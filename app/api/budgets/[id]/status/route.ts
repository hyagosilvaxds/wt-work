import { NextRequest, NextResponse } from "next/server"

interface Training {
  id: string
  name: string
  price: number
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

// Mock data - em produção, isso viria do banco de dados
let budgets: Budget[] = [
  {
    id: "1",
    budgetNumber: "ORC-2024-001",
    clientName: "João Silva",
    clientEmail: "joao@empresa.com",
    clientPhone: "(11) 99999-9999",
    companyName: "Empresa ABC Ltda",
    trainings: [
      { id: "1", name: "NR-35 - Trabalho em Altura", price: 150 },
      { id: "2", name: "NR-10 - Segurança em Instalações Elétricas", price: 200 }
    ],
    totalValue: 350,
    status: "pending",
    createdAt: "2024-01-15",
    expiresAt: "2024-02-15",
    notes: "Cliente interessado em pacote para 20 funcionários"
  },
  {
    id: "2",
    budgetNumber: "ORC-2024-002",
    clientName: "Maria Santos",
    clientEmail: "maria@construtoraxy.com",
    clientPhone: "(11) 88888-8888",
    companyName: "Construtora XY",
    trainings: [
      { id: "3", name: "NR-18 - Condições de Segurança na Construção", price: 180 }
    ],
    totalValue: 180,
    status: "approved",
    createdAt: "2024-01-10",
    expiresAt: "2024-02-10"
  }
]

// PATCH - Atualizar apenas o status do orçamento
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const budgetIndex = budgets.findIndex(b => b.id === params.id)

    if (budgetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Validar status
    const validStatuses = ['pending', 'approved', 'rejected', 'expired']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualizar apenas o status
    budgets[budgetIndex].status = status

    return NextResponse.json({
      success: true,
      data: budgets[budgetIndex],
      message: 'Status do orçamento atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar status do orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}