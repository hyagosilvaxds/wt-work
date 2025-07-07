import { NextRequest, NextResponse } from 'next/server'
import { createRole, getAllRoles } from '@/lib/api/settings'

export async function GET() {
  try {
    const result = await getAllRoles()
    
    if (result.success) {
      return NextResponse.json({ roles: result.roles })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const result = await createRole({
      name,
      description,
      permissions: permissions || []
    })

    if (result.success) {
      return NextResponse.json({ role: result.role }, { status: 201 })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
