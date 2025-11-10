// frontend/app/transactions/AddTransactionForm.jsx
'use client'
import { useEffect, useState } from 'react'
import { accountsAPI, transactionsAPI } from '@/lib/api'
import { format } from 'date-fns'

export default function AddTransactionForm({ onClose }) {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({
    account_id: '',
    description: '',
    amount: '',
    category: '',
    transaction_type: 'expense',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
  })
  const categories = {
    expense: ['Groceries', 'Dining', 'Transport', 'Shopping', 'Rent', 'Utilities', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Other']
  }

  useEffect(() => { fetchAccounts() }, [])

  const fetchAccounts = async () => {
    try {
      const res = await accountsAPI.getAccounts()
      setAccounts(res.data || [])
    } catch (err) { console.error(err) }
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      await transactionsAPI.createTransaction({ 
        ...form,
        amount: parseFloat(form.amount),
        account_id: parseInt(form.account_id, 10)
      })
      onClose && onClose()
      window.location.reload() // simple refresh to update list
    } catch (err) {
      console.error(err)
      alert('Failed to create transaction')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Account</label>
          <select required value={form.account_id} onChange={(e) => setForm({...form, account_id: e.target.value})} className="mt-1 w-full p-2 border rounded-md">
            <option value="">Select account</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.account_name} — {a.institution}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Type</label>
          <select value={form.transaction_type} onChange={(e) => setForm({...form, transaction_type: e.target.value, category: ''})} className="mt-1 w-full p-2 border rounded-md">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Category</label>
          <select required value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="mt-1 w-full p-2 border rounded-md">
            <option value="">Select</option>
            {(categories[form.transaction_type] || []).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Date</label>
          <input required type="date" value={form.transaction_date} onChange={(e) => setForm({...form, transaction_date: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Description</label>
        <input required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="mt-1 w-full p-2 border rounded-md" placeholder="eg. Grocery store" />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Amount</label>
        <input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="mt-1 w-full p-2 border rounded-md" placeholder="0.00" />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">Save</button>
      </div>
    </form>
  )
}
