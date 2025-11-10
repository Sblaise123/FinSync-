export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 modal-backdrop" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6">{children}</div>
    </div>
  )
}
