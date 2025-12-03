'use client';

import { useState } from 'react';
import { rentalsAPI } from '@/lib/api';

export default function RentalModal({ book, isOpen, onClose, onSuccess }) {
  const [selectedDays, setSelectedDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const rentalOptions = [
    { days: 7, price: book?.rental_price_7days, label: '7 วัน' },
    { days: 14, price: book?.rental_price_14days, label: '14 วัน' },
    { days: 30, price: book?.rental_price_30days, label: '30 วัน' },
  ];

  const selectedOption = rentalOptions.find(opt => opt.days === selectedDays);
  const savings = book?.full_price - selectedOption?.price;
  const savingsPercent = ((savings / book?.full_price) * 100).toFixed(0);

  const handleRent = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อนเช่าหนังสือ');
        return;
      }

      await rentalsAPI.create({
        book_id: book.book_id,
        rental_days: selectedDays,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเช่าหนังสือ');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-coffee-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-coffee-800 mb-1">
                เช่าหนังสือ
              </h2>
              <p className="text-sm text-coffee-600">{book.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-coffee-400 hover:text-coffee-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Rental Options */}
          <div>
            <label className="block text-sm font-medium text-coffee-700 mb-3">
              เลือกระยะเวลาการเช่า
            </label>
            <div className="grid grid-cols-3 gap-3">
              {rentalOptions.map((option) => (
                <button
                  key={option.days}
                  onClick={() => setSelectedDays(option.days)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDays === option.days
                      ? 'border-coffee-600 bg-coffee-50'
                      : 'border-coffee-200 hover:border-coffee-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-coffee-800">
                      {option.label}
                    </div>
                    <div className="text-sm font-semibold text-coffee-600 mt-1">
                      ฿{option.price}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-coffee-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-coffee-600">ราคาเช่า {selectedDays} วัน</span>
              <span className="text-lg font-bold text-coffee-800">
                ฿{selectedOption?.price}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-coffee-200">
              <span className="text-sm text-coffee-600">ราคาซื้อขาด</span>
              <span className="text-sm text-coffee-400 line-through">
                ฿{book.full_price}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">ประหยัด</span>
              <span className="text-sm font-bold text-green-600">
                ฿{savings.toFixed(2)} ({savingsPercent}%)
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 หนังสือจะพร้อมอ่านทันทีหลังจากชำระเงิน และจะหมดอายุใน {selectedDays} วัน
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-coffee-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
            disabled={isLoading}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleRent}
            disabled={isLoading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังดำเนินการ...' : `ชำระเงิน ฿${selectedOption?.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}