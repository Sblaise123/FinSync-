export default function OverviewCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-muted">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}
