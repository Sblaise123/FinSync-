
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { accountsAPI, transactionsAPI } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { format } from 'date-fns'

export default function Transactions() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    account_id: '',
    description: '',
    amount: '',
    category: '',
    transaction_type: 'expense',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
  })

  const categories = {
    expense: ['Groceries', 'Dining', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Insurance', 'Education', 'Travel', 'Rent', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const [transRes, accRes] = await Promise.all([
        transactionsAPI.getTransactions({ limit: 50 }),
        accountsAPI.getAccounts(),
      ])
      setTransactions(transRes.data || [])
      setAccounts(accRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await transactionsAPI.createTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: parseInt(formData.account_id),
      })
      setShowModal(false)
      setFormData({
        account_id: '',
        description: '',
        amount: '',
        category: '',
        transaction_type: 'expense',
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
      })
      fetchData()
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Failed to create transaction')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.deleteTransaction(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading transactions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Add Transaction
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found. Add your first transaction!
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                      transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add Transaction</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account</label>
                  <select
                    required
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id ?? acc.account_id} value={String(acc.id ?? acc.account_id)}>
                        {acc.account_name} - {acc.institution}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="flex items-center space-x-4 mt-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="expense"
                        checked={formData.transaction_type === 'expense'}
                        onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value, category: '' })}
                        className="mr-2"
                      />
                      Expense
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="income"
                        checked={formData.transaction_type === 'income'}
                        onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value, category: '' })}
                        className="mr-2"
                      />
                      Income
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Grocery shopping"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories[formData.transaction_type].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}