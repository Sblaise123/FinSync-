"use client"
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/dashboard" className="text-2xl font-semibold text-brand-600 hover:text-brand-700">
          FinSync
        </Link>

        <div className="flex gap-6 text-gray-600">
          <Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link>
          <Link href="/transactions" className="hover:text-brand-600">Transactions</Link>
          <Link href="/analytics" className="hover:text-brand-600">Analytics</Link>
        </div>

        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl shadow-card">
          Logout
        </button>
      </div>
    </nav>
  )
}
