import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// POST - Upload de arquivos para orçamentos
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const budgetId = formData.get('budgetId') as string

    if (!budgetId) {
      return NextResponse.json(
        { success: false, error: 'ID do orçamento é obrigatório' },
        { status: 400 }
      )
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    const uploadedFiles: string[] = []
    const uploadsDir = path.join(process.cwd(), 'uploads', 'budgets', budgetId)

    // Criar diretório se não existir
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.log('Diretório já existe ou erro ao criar:', error)
    }

    for (const file of files) {
      if (file.size === 0) continue

      // Validar tipo de arquivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Tipo de arquivo não permitido: ${file.type}` },
          { status: 400 }
        )
      }

      // Validar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `Arquivo muito grande: ${file.name}. Máximo 10MB.` },
          { status: 400 }
        )
      }

      // Gerar nome único para o arquivo
      const timestamp = new Date().getTime()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${sanitizedName}`
      const filePath = path.join(uploadsDir, fileName)

      // Salvar arquivo
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      uploadedFiles.push(fileName)
    }

    return NextResponse.json({
      success: true,
      data: {
        budgetId,
        files: uploadedFiles,
        uploadPath: `/uploads/budgets/${budgetId}`
      },
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`
    })
  } catch (error) {
    console.error('Erro no upload de arquivos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor no upload' },
      { status: 500 }
    )
  }
}