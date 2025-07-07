import { NextResponse } from 'next/server'
import { getAllPermissions } from '@/lib/api/settings'

export async function GET() {
  try {
    const result = await getAllPermissions()
    
    if (result.success) {
      return NextResponse.json({ permissions: result.permissions })
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
