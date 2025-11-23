import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

interface Link {
  id: number
  code: string
  url: string
  clicks: number
  lastClicked: Date | null
  createdAt: Date
}

function generateCode(): string {
  return randomBytes(4).toString('hex').slice(0, 6) // 6 chars
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code)
}

export async function POST(request: NextRequest) {
  try {
    const { url, code } = await request.json()

    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    let finalCode = code
    if (!finalCode) {
      finalCode = generateCode()
    } else if (!isValidCode(finalCode)) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    // Check if code exists
    const existing = await prisma.link.findUnique({
      where: { code: finalCode }
    })

    if (existing) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
    }

    const link = await prisma.link.create({
      data: {
        code: finalCode,
        url
      }
    })

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

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    }) as Link[]

    return NextResponse.json(links.map((link: Link) => ({
      id: link.id,
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    })))
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}