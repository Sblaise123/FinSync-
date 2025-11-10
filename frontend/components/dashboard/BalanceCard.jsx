export default function BalanceCard({ balance = 0 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-muted">Balance</div>
      <div className="mt-2 text-2xl font-semibold">${balance.toFixed(2)}</div>
    </div>
  )
}
