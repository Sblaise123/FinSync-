// frontend/app/(auth)/register/RegisterForm.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.register(form)
      // auto-login
      const loginRes = await authAPI.login({ username: form.username, password: form.password })
      const token = loginRes.data.access_token || loginRes.data.token || loginRes.data.access
      const me = await authAPI.getMe()
      setAuth(token, me.data)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <label className="block text-sm text-gray-700">Username</label>
        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2" required />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2" required />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Password</label>
        <input type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2" required />
      </div>

      <div className="flex justify-between items-center">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">{loading ? 'Creating…' : 'Create account'}</button>
        <a href="/login" className="text-sm text-muted">Sign in</a>
      </div>
    </form>
  )
}
