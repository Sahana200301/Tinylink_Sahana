import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const link = await prisma.link.findUnique({
      where: { code }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: link.id,
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const link = await prisma.link.findUnique({
      where: { code }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await prisma.link.delete({
      where: { code }
    })

    return NextResponse.json({ message: 'Link deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}