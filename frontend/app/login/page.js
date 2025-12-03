'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await authAPI.login(formData);
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coffee-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-coffee-800 mb-2">
              เข้าสู่ระบบ
            </h2>
            <p className="text-coffee-600">
              ยินดีต้อนรับกลับสู่ BookLease
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-2">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-coffee-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-coffee-600">
              ยังไม่มีบัญชี?{' '}
              <Link
                href="/register"
                className="font-medium text-coffee-700 hover:text-coffee-800"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-coffee-50 rounded-lg">
            <p className="text-xs text-coffee-600 text-center mb-2">
              💡 ทดสอบระบบ (Demo)
            </p>
            <p className="text-xs text-coffee-500 text-center">
              Email: test@example.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}