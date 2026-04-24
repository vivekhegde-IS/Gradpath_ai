// frontend/app/layout.js
import Link from 'next/link'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import Navbar from '../components/Navbar'

export const metadata = {
  title: 'GradPath AI - University & Career Mentor',
  description: 'AI-powered guidance for students studying abroad.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy text-white min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
