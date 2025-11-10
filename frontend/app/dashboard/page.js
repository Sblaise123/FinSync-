'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LineChart from '@/components/charts/LineChart'
import { accountsAPI, transactionsAPI } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'

export default function Dashboard() {
  const router = useRouter()
  const [accounts, setAccounts] = useState([])
  const [stats, setStats] = useState(null)
  const [monthlyData, setMonthlyData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [accountsRes, statsRes, monthlyRes] = await Promise.all([
        accountsAPI.getAccounts(),
        transactionsAPI.getStats(),
        transactionsAPI.getMonthly({ year: new Date().getFullYear() }),
      ])

      setAccounts(accountsRes.data || [])
      setStats(statsRes.data || null)
      setMonthlyData(monthlyRes.data || null)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="p-6">
        <Navbar />
        <div>Loading dashboard...</div>
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total Balance</div>
          <div className="text-xl font-bold">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {stats && (
          <>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Total Income</div>
              <div className="text-xl font-bold">
                ${stats.total_income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Total Expenses</div>
              <div className="text-xl font-bold">
                ${stats.total_expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Net Income</div>
              <div
                className={`text-xl font-bold ${
                  stats.net_income >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ${stats.net_income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Accounts */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Your Accounts</h2>
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id || account.account_number || JSON.stringify(account)} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{account.account_name}</div>
                <div className="text-sm text-gray-500">{account.institution}</div>
                <div className="text-sm text-gray-400">{account.account_type}</div>
              </div>
              <div className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      {monthlyData && (
        <div className="p-4 border rounded">
          <h3 className="text-md font-medium mb-2">Monthly Overview</h3>
          <LineChart data={monthlyData} />
        </div>
      )}
    </div>
  )
}