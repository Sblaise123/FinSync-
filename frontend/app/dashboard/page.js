"use client"
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import LineChart from '@/components/charts/LineChart'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar />
      <div className="pt-24 px-8 max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back 👋</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Balance">$12,430</Card>
          <Card title="Monthly Income">$3,200</Card>
          <Card title="Monthly Expenses">$1,450</Card>
          <Card title="Savings Goal">78%</Card>
        </div>

        <Card title="Spending Overview">
          <LineChart />
        </Card>
      </div>
    </div>
  )
}
