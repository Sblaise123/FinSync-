// frontend/app/(auth)/register/page.jsx
'use client'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Create an account</h2>
        <RegisterForm />
      </div>
    </div>
  )
}
