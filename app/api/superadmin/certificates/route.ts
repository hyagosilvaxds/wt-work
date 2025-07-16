import { NextRequest, NextResponse } from 'next/server'
import { getCertificates, createCertificate, getCertificateById, updateCertificate, deleteCertificate } from '@/lib/api/certificates'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const studentId = searchParams.get('studentId')
    const trainingId = searchParams.get('trainingId')
    const classId = searchParams.get('classId')

    const result = await getCertificates({
      page,
      limit,
      search,
      studentId,
      trainingId,
      classId
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao buscar certificados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const certificate = await createCertificate(body)
    
    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar certificado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
