// frontend/app/transactions/page.jsx
'use client'
import TransactionsTable from './TransactionTable'
import AddTransactionForm from './AddTransactionForm'
import { useState } from 'react'

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md">Add Transaction</button>
      </div>

      <TransactionsTable />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 modal-backdrop" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <AddTransactionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
