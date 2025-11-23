'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Link {
  id: number
  code: string
  url: string
  clicks: number
  lastClicked: Date | null
  createdAt: Date
}

export default function StatsPage() {
  const { code } = useParams() as { code: string }
  const [link, setLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (code) {
      fetch(`/api/links/${code}`)
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error('Link not found')
          }
        })
        .then(setLink)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [code])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!link) return <div className="min-h-screen flex items-center justify-center">Link not found</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Link Statistics</h1>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium">Short Code</label>
            <p className="text-lg">{link.code}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Original URL</label>
            <p className="text-lg break-all">{link.url}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Total Clicks</label>
            <p className="text-lg">{link.clicks}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Last Clicked</label>
            <p className="text-lg">
              {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium">Created At</label>
            <p className="text-lg">{new Date(link.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <a
              href={`/${link.code}`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Visit Link
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}