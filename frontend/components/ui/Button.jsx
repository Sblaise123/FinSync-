export default function Button({ children, onClick, className = '', ...props }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-primary-600 text-white rounded-md ${className}`} {...props}>
      {children}
    </button>
  )
}
