import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navigation/Navbar'
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Agronomy Club - Agricultural Excellence',
  description:
    'Official website of the Agronomy Club sharing agricultural research, community initiatives, and educational resources.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans text-soil-800`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-green-900 text-green-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm">&copy; {currentYear} Agronomy Club. All rights reserved.</p>
              <p className="text-xs text-green-300 mt-2">agronomyclub.org</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}