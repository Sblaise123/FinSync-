// frontend/app/dashboard/AccountSummary.jsx
export default function AccountSummary({ accounts = [] }) {
  if (!accounts.length) return <div className="text-sm text-muted">No accounts</div>

  return (
    <div className="space-y-3">
      {accounts.map((a) => (
        <div key={a.id} className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm">
          <div>
            <div className="text-sm font-medium">{a.account_name}</div>
            <div className="text-xs text-muted">{a.institution}</div>
          </div>
          <div className="text-sm font-semibold">${(a.balance || 0).toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
