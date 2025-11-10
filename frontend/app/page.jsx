"use client"

export default function LandingPage() {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-6">Welcome to FinSync</h1>
      <p className="text-lg text-blue-100 max-w-2xl mb-8">
        Simplify your finances, track your spending, and visualize your goals — all in one sleek dashboard.
      </p>
      <a
        href="/login"
        className="bg-white text-brand-600 px-8 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform"
      >
        Get Started
      </a>
    </section>
  )
}
