import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BookLease - เช่า E-book ราคาประหยัด',
  description: 'แพลตฟอร์มเช่า E-book ออนไลน์ ราคาถูก เริ่มต้นเพียง 7 วัน',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-coffee-50`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}