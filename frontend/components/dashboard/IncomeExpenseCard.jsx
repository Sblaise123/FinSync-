export default function IncomeExpenseCard({ income = 0, expense = 0 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted">Income</div>
          <div className="text-lg font-semibold text-green-600">${income.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-muted">Expenses</div>
          <div className="text-lg font-semibold text-red-600">${expense.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
