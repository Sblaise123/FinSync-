export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-glow border border-gray-100 transition-all">
      {title && <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>}
      {children}
    </div>
  )
}
