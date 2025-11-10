// frontend/app/transactions/TransactionTable.jsx
'use client'
import { useEffect, useState } from 'react'
import { transactionsAPI } from '@/lib/api'

export default function TransactionsTable() {
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch(); }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await transactionsAPI.getTransactions({ limit: 100 })
      setTxs(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete transaction?')) return
    try {
      await transactionsAPI.deleteTransaction(id)
      fetch()
    } catch (err) { console.error(err) }
  }

  if (loading) return <div className="text-center py-6">Loading…</div>

  if (!txs.length) return <div className="text-center text-muted">No transactions yet.</div>

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-xs text-muted">Date</th>
            <th className="p-3 text-left text-xs text-muted">Description</th>
            <th className="p-3 text-left text-xs text-muted">Account</th>
            <th className="p-3 text-left text-xs text-muted">Category</th>
            <th className="p-3 text-right text-xs text-muted">Amount</th>
            <th className="p-3 text-center text-xs text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((t) => (
            <tr key={t.id} className="border-b last:border-none">
              <td className="p-3 text-sm">{new Date(t.transaction_date).toLocaleDateString()}</td>
              <td className="p-3 text-sm">{t.description}</td>
              <td className="p-3 text-sm">{t.account_name || t.account?.account_name || '—'}</td>
              <td className="p-3 text-sm">{t.category}</td>
              <td className={`p-3 text-sm text-right font-medium ${t.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>${Math.abs(t.amount).toFixed(2)}</td>
              <td className="p-3 text-center text-sm"><button onClick={() => handleDelete(t.id)} className="text-red-600">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
