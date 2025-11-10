// frontend/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FinSync - Personal Finance Dashboard',
  description: 'Track your finances, visualize spending, and manage budgets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
