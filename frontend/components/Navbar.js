'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/books', label: 'หนังสือทั้งหมด' },
  ];

  const userLinks = isLoggedIn ? [
    { href: '/my-library', label: 'ห้องสมุดของฉัน' },
    { href: '/history', label: 'ประวัติการเช่า' },
  ] : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-coffee-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">📚</span>
            </div>
            <span className="text-2xl font-bold text-coffee-700">BookLease</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-coffee-600 ${
                  pathname === link.href ? 'text-coffee-600' : 'text-coffee-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-coffee-600 ${
                  pathname === link.href ? 'text-coffee-600' : 'text-coffee-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-coffee-700">
                  สวัสดี, {user?.full_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-coffee-700 hover:text-coffee-600">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="btn-primary">
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-coffee-700 hover:bg-coffee-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-coffee-100">
            <div className="flex flex-col space-y-3">
              {[...navLinks, ...userLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-coffee-100 text-coffee-700'
                      : 'text-coffee-800 hover:bg-coffee-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-sm text-coffee-600">
                    สวัสดี, {user?.full_name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mx-4 btn-secondary text-center"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="mx-4 btn-secondary text-center"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="mx-4 btn-primary text-center"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}