// frontend/app/dashboard/DashboardOverview.jsx
'use client'
import { useEffect, useState } from 'react'
import { transactionsAPI } from '@/lib/api'

export default function RecentTransactions() {
  const [txs, setTxs] = useState([])

  useEffect(() => {
    fetchRecent()
  }, [])

  const fetchRecent = async () => {
    try {
      const res = await transactionsAPI.getTransactions({ limit: 5 })
      setTxs(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  if (!txs || txs.length === 0) {
    return <div className="text-sm text-muted">No recent transactions</div>
  }

  return (
    <ul className="space-y-3">
      {txs.map((t) => (
        <li key={t.id} className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{t.description}</div>
            <div className="text-xs text-muted">{new Date(t.transaction_date).toLocaleDateString()}</div>
          </div>
          <div className={`text-sm font-semibold ${t.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(t.amount).toFixed(2)}
          </div>
        </li>
      ))}
    </ul>
  )
}
