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

// Mock data
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
  }
]

// GET - Gerar PDF do orçamento
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

    // Em uma implementação real, aqui você geraria o PDF usando uma biblioteca como puppeteer ou jsPDF
    // Por enquanto, vamos retornar um HTML que pode ser usado para gerar o PDF no frontend

    const html = generateBudgetHTML(budget)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="orcamento-${budget.budgetNumber}.html"`
      }
    })
  } catch (error) {
    console.error('Erro ao gerar PDF do orçamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generateBudgetHTML(budget: Budget): string {
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
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .budget-number {
            font-size: 18px;
            color: #666;
        }

        .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-item {
            margin-bottom: 10px;
        }

        .label {
            font-weight: bold;
            color: #374151;
        }

        .value {
            color: #6b7280;
        }

        .trainings-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .trainings-table th,
        .trainings-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        .trainings-table th {
            background-color: #f9fafb;
            font-weight: bold;
        }

        .total-row {
            font-weight: bold;
            background-color: #f3f4f6;
        }

        .total-value {
            font-size: 18px;
            color: #2563eb;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-approved { background-color: #d1fae5; color: #065f46; }
        .status-rejected { background-color: #fee2e2; color: #991b1b; }
        .status-expired { background-color: #f3f4f6; color: #374151; }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }

        @media print {
            body { margin: 0; padding: 15px; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Work Treinamentos</div>
        <div class="budget-number">Orçamento ${budget.budgetNumber}</div>
        <div style="margin-top: 10px;">
            <span class="status-badge status-${budget.status}">${statusMap[budget.status]}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Informações do Cliente</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Nome:</div>
                <div class="value">${budget.clientName}</div>
            </div>
            <div class="info-item">
                <div class="label">E-mail:</div>
                <div class="value">${budget.clientEmail}</div>
            </div>
            <div class="info-item">
                <div class="label">Empresa:</div>
                <div class="value">${budget.companyName}</div>
            </div>
            <div class="info-item">
                <div class="label">Telefone:</div>
                <div class="value">${budget.clientPhone || 'Não informado'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Informações do Orçamento</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Data de Criação:</div>
                <div class="value">${new Date(budget.createdAt).toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="info-item">
                <div class="label">Data de Expiração:</div>
                <div class="value">${new Date(budget.expiresAt).toLocaleDateString('pt-BR')}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Treinamentos</div>
        <table class="trainings-table">
            <thead>
                <tr>
                    <th>Treinamento</th>
                    <th style="text-align: right;">Valor</th>
                </tr>
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
                    <td style="text-align: right;" class="total-value">
                        <strong>R$ ${budget.totalValue.toFixed(2).replace('.', ',')}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    ${budget.notes ? `
    <div class="section">
        <div class="section-title">Observações</div>
        <div style="white-space: pre-wrap;">${budget.notes}</div>
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