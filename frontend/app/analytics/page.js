"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'  
import PieChart from '@/components/charts/PieChart'
import { transactionsAPI } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'

export default function Analytics() {
  const router = useRouter()
  const [categoryStats, setCategoryStats] = useState([])
  const [transactionType, setTransactionType] = useState('expense')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchCategoryStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionType])

  const fetchCategoryStats = async () => {
    try {
      const response = await transactionsAPI.getCategoryStats({
        transaction_type: transactionType,
      })
      setCategoryStats(response.data)
    } catch (error) {
      console.error('Error fetching category stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
          <div className="p-6 bg-white rounded shadow text-center">Loading analytics...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Analytics</h1>

        {/* Toggle */}
        <div className="inline-flex mb-6 rounded-lg border">
          <button
            onClick={() => setTransactionType('expense')}
            className={`px-6 py-2 text-sm font-medium rounded-l-lg border-r ${
              transactionType === 'expense'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setTransactionType('income')}
            className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
              transactionType === 'income'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Income
          </button>
        </div>

        {/* Chart and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            {categoryStats.length > 0 ? (
              <PieChart
                data={categoryStats}
                title={`${transactionType === 'expense' ? 'Expense' : 'Income'} by Category`}
              />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-4 rounded shadow">
            <div className="font-medium mb-3">Category Breakdown</div>
            <div>
              {categoryStats.length > 0 ? (
                categoryStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: stat.color || '#ccc' }}
                      />
                      <div>
                        <div className="font-medium">{stat.category}</div>
                        <div className="text-sm text-gray-500">
                          ${Number(stat.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{Number(stat.percentage || 0).toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">{stat.count || 0} transactions</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No categories found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}