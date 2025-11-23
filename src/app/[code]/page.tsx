import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function RedirectPage({
  params
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  // Validate code format
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    notFound()
  }

  const link = await prisma.link.findUnique({
    where: { code }
  })

  if (!link) {
    notFound()
  }

  // Increment clicks and update lastClicked
  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date()
    }
  })

  redirect(link.url)
}