import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-coffee-800 text-coffee-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-coffee-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <span className="text-2xl font-bold text-white">BookLease</span>
            </div>
            <p className="text-coffee-200 mb-4 max-w-md">
              แพลตฟอร์มเช่า E-book ออนไลน์ ราคาประหยัด เริ่มต้นเพียง 7 วัน 
              อ่านหนังสือดีๆ ไม่ต้องซื้อราคาแพง
            </p>
            <p className="text-coffee-300 text-sm">
              © 2024 BookLease. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">เมนูหลัก</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-coffee-200 hover:text-white transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-coffee-200 hover:text-white transition-colors">
                  หนังสือทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/my-library" className="text-coffee-200 hover:text-white transition-colors">
                  ห้องสมุดของฉัน
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-coffee-200 hover:text-white transition-colors">
                  ประวัติการเช่า
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-coffee-200">
              <li>📧 support@booklease.com</li>
              <li>📱 02-xxx-xxxx</li>
              <li>⏰ จันทร์-ศุกร์ 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-8 pt-8 text-center text-coffee-300 text-sm">
          <p>Made with ☕ and 📚 for book lovers</p>
        </div>
      </div>
    </footer>
  );
}