'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { clearAuth, getAuth } from '@/lib/auth'

export default function Navbar() {
  const router = useRouter()
  const { user } = getAuth()

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <nav>
      <div>
        <div>
          <div>FinSync</div>

          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/transactions">Transactions</Link></li>
            <li><Link href="/analytics">Analytics</Link></li>
          </ul>
        </div>

        <div>
          {user && (
            <span>Welcome, {user.username}</span>
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}