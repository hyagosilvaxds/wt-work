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

// GET - Listar todos os orçamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredBudgets = budgets

    // Filtrar por status
    if (status && status !== 'all') {
      filteredBudgets = filteredBudgets.filter(budget => budget.status === status)
    }

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBudgets = filteredBudgets.filter(budget =>
        budget.clientName.toLowerCase().includes(searchLower) ||
        budget.companyName.toLowerCase().includes(searchLower) ||
        budget.budgetNumber.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredBudgets,
      total: filteredBudgets.length
    })
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo orçamento
export async function POST(request: NextRequest) {
  try {
    const budgetData = await request.json()

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

    // Gerar ID único
    const newId = (Math.max(...budgets.map(b => parseInt(b.id)), 0) + 1).toString()

    // Criar novo orçamento
    const newBudget: Budget = {
      id: newId,
      budgetNumber: budgetData.budgetNumber || `ORC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      clientName: budgetData.clientName,
      clientEmail: budgetData.clientEmail,
      clientPhone: budgetData.clientPhone || "",
      companyName: budgetData.companyName,
      trainings: budgetData.trainings,
      totalValue: budgetData.trainings.reduce((sum: number, t: Training) => sum + t.price, 0),
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: budgetData.expiresAt,
      notes: budgetData.notes || "",
      attachments: budgetData.attachments || [],
      dailyWorkload: budgetData.dailyWorkload || ""
    }

    // Adicionar à lista
    budgets.push(newBudget)

    return NextResponse.json({
      success: true,
      data: newBudget,
      message: 'Orçamento criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}