'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
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

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return false;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      
      // Auto login after register
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
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
              สมัครสมาชิก
            </h2>
            <p className="text-coffee-600">
              เริ่มต้นเช่าหนังสือกับเราวันนี้
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-coffee-700 mb-2">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder="สมชาย ใจดี"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-2">
                อีเมล <span className="text-red-500">*</span>
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
              <label htmlFor="phone" className="block text-sm font-medium text-coffee-700 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="081-234-5678"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-coffee-700 mb-2">
                รหัสผ่าน <span className="text-red-500">*</span>
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
              <p className="text-xs text-coffee-500 mt-1">
                ต้องมีความยาวอย่างน้อย 6 ตัวอักษร
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-coffee-700 mb-2">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
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
              {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-coffee-600">
              มีบัญชีอยู่แล้ว?{' '}
              <Link
                href="/login"
                className="font-medium text-coffee-700 hover:text-coffee-800"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}