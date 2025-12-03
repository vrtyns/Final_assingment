'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { rentalsAPI } from '@/lib/api';

export default function MyLibraryPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [extendingId, setExtendingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/my-library');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rentalsData, statsData] = await Promise.all([
        rentalsAPI.getActive(),
        rentalsAPI.getStats(),
      ]);
      setRentals(rentalsData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('token')) {
        router.push('/login?redirect=/my-library');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtend = async (rentalId, currentDays) => {
    if (!confirm('ต้องการต่ออายุการเช่าหนังสือเล่มนี้หรือไม่?')) {
      return;
    }

    try {
      setExtendingId(rentalId);
      await rentalsAPI.extend(rentalId, { extend_days: 7 });
      alert('ต่ออายุการเช่าสำเร็จ!');
      loadData();
    } catch (error) {
      alert(error.message || 'เกิดข้อผิดพลาดในการต่ออายุ');
    } finally {
      setExtendingId(null);
    }
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (daysRemaining <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-coffee-200 border-t-coffee-600"></div>
          <p className="mt-4 text-coffee-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-2">
            ห้องสมุดของฉัน
          </h1>
          <p className="text-coffee-600">
            หนังสือที่คุณกำลังเช่าอยู่
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-600 mb-1">กำลังเช่า</p>
                  <p className="text-3xl font-bold text-coffee-800">
                    {stats.active_rentals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-600 mb-1">เช่าทั้งหมด</p>
                  <p className="text-3xl font-bold text-coffee-800">
                    {stats.total_rentals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-coffee-600 mb-1">ยอดใช้จ่ายรวม</p>
                  <p className="text-3xl font-bold text-coffee-800">
                    {/* ฿{stats.total_spent?.toFixed(2) || '0.00'} */}
                    ฿{Number(stats.total_spent || 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rentals List */}
        {rentals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-coffee-800 mb-2">
              ยังไม่มีหนังสือที่กำลังเช่า
            </h3>
            <p className="text-coffee-600 mb-6">
              เริ่มเลือกหนังสือและเช่าเพื่ออ่านได้เลย
            </p>
            <Link href="/books" className="btn-primary">
              เลือกหนังสือ
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {rentals.map((rental) => {
              const daysRemaining = getDaysRemaining(rental.rental_end);
              const statusColor = getStatusColor(daysRemaining);

              return (
                <div key={rental.rental_id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="md:flex">
                    {/* Book Cover */}
                    <div className="md:flex-shrink-0">
                      <div className="relative h-48 md:h-full md:w-48 bg-coffee-100">
                        <Image
                          src={rental.cover_image || '/placeholder-book.jpg'}
                          alt={rental.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="flex-1 mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-primary">{rental.category}</span>
                            <span className={`badge border ${statusColor}`}>
                              {rental.status === 'active' ? 'กำลังเช่า' : 'ต่ออายุแล้ว'}
                            </span>
                          </div>
                          <Link 
                            href={`/books/${rental.book_id}`}
                            className="text-xl md:text-2xl font-bold text-coffee-800 hover:text-coffee-600 transition-colors"
                          >
                            {rental.title}
                          </Link>
                          <p className="text-coffee-600 mt-1">{rental.author}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-coffee-600 mb-1">ราคาที่จ่าย</p>
                          <p className="text-2xl font-bold text-coffee-800">
                            ฿{rental.price_paid}
                          </p>
                        </div>
                      </div>

                      {/* Rental Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-coffee-50 rounded-lg p-4">
                          <p className="text-xs text-coffee-600 mb-1">วันที่เช่า</p>
                          <p className="font-semibold text-coffee-800">
                            {new Date(rental.rental_start).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="bg-coffee-50 rounded-lg p-4">
                          <p className="text-xs text-coffee-600 mb-1">วันหมดอายุ</p>
                          <p className="font-semibold text-coffee-800">
                            {new Date(rental.rental_end).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className={`rounded-lg p-4 border ${statusColor}`}>
                          <p className="text-xs mb-1">เหลือเวลา</p>
                          <p className="font-bold text-lg">
                            {daysRemaining > 0 ? `${daysRemaining} วัน` : 'หมดอายุแล้ว'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/books/${rental.book_id}`}
                          className="flex-1 text-center btn-secondary"
                        >
                          เริ่มอ่าน
                        </Link>
                        
                        {daysRemaining > 0 && (
                          <button
                            onClick={() => handleExtend(rental.rental_id, rental.rental_days)}
                            disabled={extendingId === rental.rental_id}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {extendingId === rental.rental_id ? 'กำลังดำเนินการ...' : 'ต่ออายุ 7 วัน'}
                          </button>
                        )}

                        {daysRemaining <= 0 && (
                          <div className="flex-1 text-center py-3 bg-red-50 text-red-600 rounded-lg font-medium">
                            หนังสือหมดอายุแล้ว
                          </div>
                        )}
                      </div>

                      {/* Warning Messages */}
                      {daysRemaining <= 2 && daysRemaining > 0 && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-600">
                            ⚠️ หนังสือเล่มนี้จะหมดอายุในอีก {daysRemaining} วัน กรุณาต่ออายุหากต้องการอ่านต่อ
                          </p>
                        </div>
                      )}

                      {daysRemaining <= 5 && daysRemaining > 2 && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-700">
                            💡 หนังสือเล่มนี้จะหมดอายุในอีก {daysRemaining} วัน สามารถต่ออายุได้ตลอดเวลา
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-coffee-800 mb-4">ทำอะไรต่อดี?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/books"
              className="flex items-center gap-3 p-4 border border-coffee-200 rounded-lg hover:bg-coffee-50 transition-colors"
            >
              <span className="text-3xl">🔍</span>
              <div>
                <p className="font-semibold text-coffee-800">เลือกหนังสือเพิ่ม</p>
                <p className="text-sm text-coffee-600">ค้นหาหนังสือที่น่าสนใจ</p>
              </div>
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-3 p-4 border border-coffee-200 rounded-lg hover:bg-coffee-50 transition-colors"
            >
              <span className="text-3xl">📜</span>
              <div>
                <p className="font-semibold text-coffee-800">ดูประวัติการเช่า</p>
                <p className="text-sm text-coffee-600">รายการที่เคยเช่าทั้งหมด</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}