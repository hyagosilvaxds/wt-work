import { NextRequest, NextResponse } from 'next/server'
import { updateUser, deleteUser } from '@/lib/api/settings'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, role, status } = body
    const userId = params.id

    const result = await updateUser(userId, {
      name,
      email,
      role,
      status
    })

    if (result.success) {
      return NextResponse.json({ user: result.user })
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
    const userId = params.id

    const result = await deleteUser(userId)

    if (result.success) {
      return NextResponse.json({ message: 'User deleted successfully' })
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
