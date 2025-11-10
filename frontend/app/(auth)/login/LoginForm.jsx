// frontend/app/(auth)/login/LoginForm.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      // backend should return { access_token: '...' } or token
      const token = res.data.access_token || res.data.token || res.data.access
      if (!token) throw new Error('No token returned')
      // try to fetch user
      const me = await authAPI.getMe()
      setAuth(token, me.data)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <label className="block text-sm text-gray-700">Username</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 p-2"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/register" className="text-sm text-muted">Create account</a>
      </div>

      <div className="mt-4 text-sm text-muted">
        Demo: <strong>demo / demo123</strong>
      </div>
    </form>
  )
}
