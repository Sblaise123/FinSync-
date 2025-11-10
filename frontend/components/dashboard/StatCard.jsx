// frontend/components/dashboard/StatsCard.jsx
export default function StatsCard({ title, value, description }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px]">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {description && <div className="mt-1 text-xs text-gray-500">{description}</div>}
    </div>
  )
}
