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
  dailyWorkload?: string
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

// GET - Buscar orçamento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budget = budgets.find(b => b.id === params.id)

    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: budget
    })
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar orçamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budgetData = await request.json()
    const budgetIndex = budgets.findIndex(b => b.id === params.id)

    if (budgetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Validação básica
    if (!budgetData.clientName || !budgetData.clientEmail || !budgetData.companyName) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    if (!budgetData.trainings || budgetData.trainings.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pelo menos um treinamento deve ser selecionado' },
        { status: 400 }
      )
    }

    // Atualizar orçamento
    const updatedBudget: Budget = {
      ...budgets[budgetIndex],
      clientName: budgetData.clientName,
      clientEmail: budgetData.clientEmail,
      clientPhone: budgetData.clientPhone || "",
      companyName: budgetData.companyName,
      trainings: budgetData.trainings,
      totalValue: budgetData.trainings.reduce((sum: number, t: Training) => sum + t.price, 0),
      expiresAt: budgetData.expiresAt,
      notes: budgetData.notes || "",
      attachments: budgetData.attachments || [],
      status: budgetData.status || budgets[budgetIndex].status,
      dailyWorkload: budgetData.dailyWorkload !== undefined ? budgetData.dailyWorkload : budgets[budgetIndex].dailyWorkload
    }

    budgets[budgetIndex] = updatedBudget

    return NextResponse.json({
      success: true,
      data: updatedBudget,
      message: 'Orçamento atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir orçamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budgetIndex = budgets.findIndex(b => b.id === params.id)

    if (budgetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Remover orçamento
    budgets.splice(budgetIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Orçamento excluído com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}