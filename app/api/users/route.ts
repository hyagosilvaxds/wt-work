import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAllUsers } from '@/lib/api/settings'

export async function GET() {
  try {
    const result = await getAllUsers()
    
    if (result.success) {
      return NextResponse.json({ users: result.users })
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
    const { name, email, password, role, status } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createUser({
      name,
      email,
      password,
      role,
      status
    })

    if (result.success) {
      return NextResponse.json({ user: result.user }, { status: 201 })
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
