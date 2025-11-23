'use client'

import { useState, useEffect } from 'react'

interface Link {
  id: number
  code: string
  url: string
  clicks: number
  lastClicked: Date | null
  createdAt: Date
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([])
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const res = await fetch('/api/links')
    if (res.ok) {
      const data = await res.json()
      setLinks(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    })

    if (res.ok) {
      const newLink = await res.json()
      setLinks([newLink, ...links])
      setUrl('')
      setCode('')
      setSuccess('Link created successfully!')
    } else {
      const err = await res.json()
      setError(err.error)
    }
    setLoading(false)
  }

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    const res = await fetch(`/api/links/${code}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setLinks(links.filter(l => l.code !== code))
    } else {
      alert('Failed to delete link')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">🔗 TinyLink Dashboard</h1>
          <p className="text-black text-lg">Create and manage your short links effortlessly</p>
        </header>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-black mb-6">Create Short Link</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black font-medium mb-2">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-black font-medium mb-2">Custom Code (optional)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                pattern="[A-Za-z0-9]{6,8}"
                placeholder="abc123"
              />
            </div>
            {error && <p className="text-black bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
            {success && <p className="text-black bg-green-100 p-3 rounded-lg border border-green-200">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-black mb-6">Your Links</h2>
          {links.length === 0 ? (
            <p className="text-black text-center py-8">No links yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 text-black font-semibold">Code</th>
                    <th className="text-left p-3 text-black font-semibold">URL</th>
                    <th className="text-left p-3 text-black font-semibold">Clicks</th>
                    <th className="text-left p-3 text-black font-semibold">Last Clicked</th>
                    <th className="text-left p-3 text-black font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <a href={`/${link.code}`} className="text-black hover:text-gray-700 font-medium hover:underline">
                          {link.code}
                        </a>
                      </td>
                      <td className="p-3 text-black truncate max-w-xs" title={link.url}>
                        {link.url}
                      </td>
                      <td className="p-3 text-black">{link.clicks}</td>
                      <td className="p-3 text-black">
                        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="text-black hover:text-gray-700 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
