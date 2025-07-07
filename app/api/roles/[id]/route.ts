import { NextRequest, NextResponse } from 'next/server'
import { updateRole, deleteRole } from '@/lib/api/settings'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body
    const roleId = params.id

    const result = await updateRole(roleId, {
      name,
      description,
      permissions
    })

    if (result.success) {
      return NextResponse.json({ role: result.role })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id

    const result = await deleteRole(roleId)

    if (result.success) {
      return NextResponse.json({ message: 'Role deleted successfully' })
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
