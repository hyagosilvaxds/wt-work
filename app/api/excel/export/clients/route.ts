import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      isActive,
      search,
      city,
      state,
      personType,
      startDate,
      endDate
    } = body

    // Construir filtros para busca
    const whereClause: any = {}

    if (typeof isActive === 'boolean') {
      whereClause.isActive = isActive
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search, mode: 'insensitive' } },
        { corporateName: { contains: search, mode: 'insensitive' } },
        { responsibleName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' }
    }

    if (state) {
      whereClause.state = { contains: state, mode: 'insensitive' }
    }

    if (personType) {
      whereClause.personType = personType
    }

    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate + 'T23:59:59.999Z')
      }
    }

    // Buscar clientes através da API do backend
    const queryParams = new URLSearchParams()
    
    if (typeof isActive === 'boolean') {
      queryParams.append('isActive', isActive.toString())
    }
    if (search) {
      queryParams.append('search', search)
    }
    if (city) {
      queryParams.append('city', city)
    }
    if (state) {
      queryParams.append('state', state)
    }
    if (personType) {
      queryParams.append('personType', personType)
    }
    if (startDate) {
      queryParams.append('startDate', startDate)
    }
    if (endDate) {
      queryParams.append('endDate', endDate)
    }

    // Buscar todos os clientes (sem paginação para exportação)
    queryParams.append('limit', '999999')
    queryParams.append('includeStats', 'true')

    const response = await axios.get(`worktreinamentos.olimpustech.com/superadmin/clients?${queryParams.toString()}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    })

    const clients = response.data.clients || []

    // Criar workbook Excel
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Clientes')

    // Definir colunas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 25 },
      { header: 'Nome', key: 'name', width: 25 },
      { header: 'Nome Fantasia', key: 'corporateName', width: 25 },
      { header: 'Tipo de Pessoa', key: 'personType', width: 15 },
      { header: 'CPF', key: 'cpf', width: 15 },
      { header: 'CNPJ', key: 'cnpj', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Responsável', key: 'responsibleName', width: 25 },
      { header: 'Email Responsável', key: 'responsibleEmail', width: 30 },
      { header: 'Telefone Responsável', key: 'responsiblePhone', width: 20 },
      { header: 'CEP', key: 'zipCode', width: 12 },
      { header: 'Endereço', key: 'address', width: 30 },
      { header: 'Número', key: 'number', width: 10 },
      { header: 'Bairro', key: 'neighborhood', width: 20 },
      { header: 'Cidade', key: 'city', width: 20 },
      { header: 'Estado', key: 'state', width: 10 },
      { header: 'DDD Fixo', key: 'landlineAreaCode', width: 10 },
      { header: 'Telefone Fixo', key: 'landlineNumber', width: 15 },
      { header: 'DDD Celular', key: 'mobileAreaCode', width: 10 },
      { header: 'Celular', key: 'mobileNumber', width: 15 },
      { header: 'Inscrição Municipal', key: 'municipalRegistration', width: 20 },
      { header: 'Inscrição Estadual', key: 'stateRegistration', width: 20 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Total de Alunos', key: 'totalStudents', width: 15 },
      { header: 'Alunos Ativos', key: 'activeStudents', width: 15 },
      { header: 'Total de Turmas', key: 'totalClasses', width: 15 },
      { header: 'Turmas Concluídas', key: 'completedClasses', width: 15 },
      { header: 'Total de Aulas', key: 'totalLessons', width: 15 },
      { header: 'Observações', key: 'observations', width: 30 },
      { header: 'Data de Criação', key: 'createdAt', width: 15 },
      { header: 'Data de Atualização', key: 'updatedAt', width: 15 }
    ]

    // Estilizar cabeçalho
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    }

    // Definir interfaces dos dados
    interface ClientData {
      id: string
      name: string
      corporateName?: string
      personType: string
      cpf?: string
      cnpj?: string
      email?: string
      responsibleName?: string
      responsibleEmail?: string
      responsiblePhone?: string
      zipCode?: string
      address?: string
      number?: string
      neighborhood?: string
      city?: string
      state?: string
      landlineAreaCode?: string
      landlineNumber?: string
      mobileAreaCode?: string
      mobileNumber?: string
      municipalRegistration?: string
      stateRegistration?: string
      isActive: boolean
      observations?: string
      createdAt: string
      updatedAt: string
      students?: Array<{ id: string; isActive: boolean }>
      classes?: Array<{ 
        id: string
        isCompleted: boolean
        lessons?: Array<{ id: string }>
      }>
      totalStudents?: number
      activeStudents?: number
      totalClasses?: number
      completedClasses?: number
      totalLessons?: number
    }

    // Adicionar dados
    clients.forEach((client: ClientData) => {
      const totalStudents = client.totalStudents || client.students?.length || 0
      const activeStudents = client.activeStudents || client.students?.filter((s: any) => s.isActive).length || 0
      const totalClasses = client.totalClasses || client.classes?.length || 0
      const completedClasses = client.completedClasses || client.classes?.filter((c: any) => c.isCompleted).length || 0
      const totalLessons = client.totalLessons || client.classes?.reduce((acc: number, cls: any) => acc + (cls.lessons?.length || 0), 0) || 0

      worksheet.addRow({
        id: client.id,
        name: client.name,
        corporateName: client.corporateName || '',
        personType: client.personType === 'FISICA' ? 'Física' : 'Jurídica',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        email: client.email || '',
        responsibleName: client.responsibleName || '',
        responsibleEmail: client.responsibleEmail || '',
        responsiblePhone: client.responsiblePhone || '',
        zipCode: client.zipCode || '',
        address: client.address || '',
        number: client.number || '',
        neighborhood: client.neighborhood || '',
        city: client.city || '',
        state: client.state || '',
        landlineAreaCode: client.landlineAreaCode || '',
        landlineNumber: client.landlineNumber || '',
        mobileAreaCode: client.mobileAreaCode || '',
        mobileNumber: client.mobileNumber || '',
        municipalRegistration: client.municipalRegistration || '',
        stateRegistration: client.stateRegistration || '',
        status: client.isActive ? 'Ativo' : 'Inativo',
        totalStudents,
        activeStudents,
        totalClasses,
        completedClasses,
        totalLessons,
        observations: client.observations || '',
        createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR'),
        updatedAt: new Date(client.updatedAt).toLocaleDateString('pt-BR')
      })
    })

    // Criar diretório de exports se não existir
    const exportsDir = path.join(process.cwd(), 'public', 'exports')
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true })
    }

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
    const fileName = `clientes_${timestamp}.xlsx`
    const filePath = path.join(exportsDir, fileName)

    // Salvar arquivo
    await workbook.xlsx.writeFile(filePath)

    return NextResponse.json({
      filePath,
      fileName,
      downloadUrl: `/exports/${fileName}`,
      totalRecords: clients.length,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao exportar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
