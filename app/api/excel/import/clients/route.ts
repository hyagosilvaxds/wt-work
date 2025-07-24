import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import axios from 'axios'

interface ImportError {
  row: number
  field: string
  message: string
}

interface ClientRow {
  Nome?: string
  'Nome Fantasia'?: string
  'Tipo de Pessoa'?: string
  CPF?: string
  CNPJ?: string
  Email?: string
  'Responsável'?: string
  'Email Responsável'?: string
  'Telefone Responsável'?: string
  CEP?: string
  'Endereço'?: string
  'Número'?: string
  Bairro?: string
  Cidade?: string
  Estado?: string
  'DDD Fixo'?: string
  'Telefone Fixo'?: string
  'DDD Celular'?: string
  Celular?: string
  'Inscrição Municipal'?: string
  'Inscrição Estadual'?: string
  'Observações'?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const validateOnly = formData.get('validateOnly') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Verificar se é um arquivo Excel
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Apenas arquivos Excel (.xlsx, .xls) são permitidos' },
        { status: 400 }
      )
    }

    // Ler o arquivo Excel
    const buffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) {
      return NextResponse.json(
        { error: 'Planilha não encontrada no arquivo' },
        { status: 400 }
      )
    }

    const errors: ImportError[] = []
    const validRows: any[] = []
    let rowIndex = 0

    // Processar cada linha da planilha
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      // Pular cabeçalho
      if (rowNumber === 1) return

      rowIndex++

      const rowData: ClientRow = {}
      
      // Mapear colunas (assumindo ordem específica)
      const headers = [
        'Nome', 'Nome Fantasia', 'Tipo de Pessoa', 'CPF', 'CNPJ', 'Email',
        'Responsável', 'Email Responsável', 'Telefone Responsável', 'CEP',
        'Endereço', 'Número', 'Bairro', 'Cidade', 'Estado', 'DDD Fixo',
        'Telefone Fixo', 'DDD Celular', 'Celular', 'Inscrição Municipal',
        'Inscrição Estadual', 'Observações'
      ]

      headers.forEach((header, index) => {
        const cell = row.getCell(index + 1)
        rowData[header as keyof ClientRow] = cell.value?.toString() || ''
      })

      // Validações obrigatórias
      const rowErrors: ImportError[] = []

      if (!rowData.Nome || rowData.Nome.trim() === '') {
        rowErrors.push({
          row: rowIndex,
          field: 'Nome',
          message: 'Nome é obrigatório'
        })
      }

      if (!rowData['Tipo de Pessoa'] || 
          !['Física', 'Jurídica', 'FISICA', 'JURIDICA'].includes(rowData['Tipo de Pessoa'])) {
        rowErrors.push({
          row: rowIndex,
          field: 'Tipo de Pessoa',
          message: 'Tipo de Pessoa deve ser "Física" ou "Jurídica"'
        })
      }

      const isPhysical = ['Física', 'FISICA'].includes(rowData['Tipo de Pessoa'] || '')

      if (isPhysical) {
        if (!rowData.CPF || rowData.CPF.trim() === '') {
          rowErrors.push({
            row: rowIndex,
            field: 'CPF',
            message: 'CPF é obrigatório para pessoa física'
          })
        } else if (!isValidCPF(rowData.CPF)) {
          rowErrors.push({
            row: rowIndex,
            field: 'CPF',
            message: 'CPF inválido'
          })
        }
      } else {
        if (!rowData.CNPJ || rowData.CNPJ.trim() === '') {
          rowErrors.push({
            row: rowIndex,
            field: 'CNPJ',
            message: 'CNPJ é obrigatório para pessoa jurídica'
          })
        } else if (!isValidCNPJ(rowData.CNPJ)) {
          rowErrors.push({
            row: rowIndex,
            field: 'CNPJ',
            message: 'CNPJ inválido'
          })
        }
      }

      // Validar email se fornecido
      if (rowData.Email && !isValidEmail(rowData.Email)) {
        rowErrors.push({
          row: rowIndex,
          field: 'Email',
          message: 'Email inválido'
        })
      }

      // Validar email do responsável se fornecido
      if (rowData['Email Responsável'] && !isValidEmail(rowData['Email Responsável'])) {
        rowErrors.push({
          row: rowIndex,
          field: 'Email Responsável',
          message: 'Email do responsável inválido'
        })
      }

      // Validar CEP se fornecido
      if (rowData.CEP && !isValidCEP(rowData.CEP)) {
        rowErrors.push({
          row: rowIndex,
          field: 'CEP',
          message: 'CEP inválido (deve ter 8 dígitos)'
        })
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors)
      } else {
        // Converter dados para formato da API
        const clientData = {
          name: rowData.Nome,
          corporateName: rowData['Nome Fantasia'] || null,
          personType: isPhysical ? 'FISICA' : 'JURIDICA',
          cpf: isPhysical ? cleanDocument(rowData.CPF!) : null,
          cnpj: !isPhysical ? cleanDocument(rowData.CNPJ!) : null,
          email: rowData.Email || null,
          responsibleName: rowData['Responsável'] || null,
          responsibleEmail: rowData['Email Responsável'] || null,
          responsiblePhone: rowData['Telefone Responsável'] || null,
          zipCode: rowData.CEP ? cleanDocument(rowData.CEP) : null,
          address: rowData['Endereço'] || null,
          number: rowData['Número'] || null,
          neighborhood: rowData.Bairro || null,
          city: rowData.Cidade || null,
          state: rowData.Estado || null,
          landlineAreaCode: rowData['DDD Fixo'] || null,
          landlineNumber: rowData['Telefone Fixo'] || null,
          mobileAreaCode: rowData['DDD Celular'] || null,
          mobileNumber: rowData.Celular || null,
          municipalRegistration: rowData['Inscrição Municipal'] || null,
          stateRegistration: rowData['Inscrição Estadual'] || null,
          observations: rowData['Observações'] || null,
          isActive: true
        }

        validRows.push(clientData)
      }
    })

    const totalRecords = rowIndex
    const validRecords = validRows.length
    const invalidRecords = errors.length

    // Se é só validação, retornar apenas resultados
    if (validateOnly) {
      return NextResponse.json({
        success: true,
        totalRecords,
        validRecords,
        invalidRecords,
        importedRecords: 0,
        errors: errors.slice(0, 100) // Limitar a 100 erros para não sobrecarregar
      })
    }

    // Tentar importar clientes válidos
    let importedRecords = 0
    const importErrors: ImportError[] = [...errors]

    for (let i = 0; i < validRows.length; i++) {
      try {
        await axios.post('http://localhost:4000/superadmin/clients', validRows[i], {
          headers: {
            'Authorization': request.headers.get('Authorization') || '',
            'Content-Type': 'application/json'
          }
        })
        importedRecords++
      } catch (error: any) {
        let errorMessage = 'Erro ao importar registro'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        importErrors.push({
          row: i + 1,
          field: 'geral',
          message: errorMessage
        })
      }
    }

    return NextResponse.json({
      success: true,
      totalRecords,
      validRecords,
      invalidRecords: importErrors.length,
      importedRecords,
      errors: importErrors.slice(0, 100)
    })

  } catch (error) {
    console.error('Erro ao importar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Funções de validação
function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false
  }

  let length = cleanCNPJ.length - 2
  let numbers = cleanCNPJ.substring(0, length)
  const digits = cleanCNPJ.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cleanCNPJ.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

function cleanDocument(doc: string): string {
  return doc.replace(/\D/g, '')
}
