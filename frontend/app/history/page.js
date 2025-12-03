'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { rentalsAPI } from '@/lib/api';

export default function HistoryPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/history');
      return;
    }
    loadHistory();
  }, [currentPage]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await rentalsAPI.getHistory({
        page: currentPage,
        limit: 10,
      });
      setRentals(data.data.rentals);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error loading history:', error);
      if (error.message.includes('token')) {
        router.push('/login?redirect=/history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (rental) => {
    const now = new Date();
    const endDate = new Date(rental.rental_end);
    const isExpired = now > endDate;

    if (isExpired) {
      return <span className="badge bg-red-100 text-red-700">หมดอายุแล้ว</span>;
    }

    if (rental.status === 'extended') {
      return <span className="badge bg-blue-100 text-blue-700">ต่ออายุแล้ว</span>;
    }

    return <span className="badge bg-green-100 text-green-700">กำลังเช่า</span>;
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
            ประวัติการเช่า
          </h1>
          <p className="text-coffee-600">
            รายการหนังสือที่คุณเคยเช่าทั้งหมด
          </p>
        </div>

        {/* Content */}
        {rentals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-2xl font-bold text-coffee-800 mb-2">
              ยังไม่มีประวัติการเช่า
            </h3>
            <p className="text-coffee-600 mb-6">
              เริ่มเลือกหนังสือและเช่าเพื่อสร้างประวัติการอ่านของคุณ
            </p>
            <Link href="/books" className="btn-primary">
              เลือกหนังสือ
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-coffee-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        หนังสือ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        วันที่เช่า
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        ระยะเวลา
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        ราคา
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        สถานะ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-coffee-800">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-coffee-100">
                    {rentals.map((rental) => (
                      <tr key={rental.rental_id} className="hover:bg-coffee-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-16 bg-coffee-100 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={rental.cover_image || '/placeholder-book.jpg'}
                                alt={rental.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/books/${rental.book_id}`}
                                className="font-semibold text-coffee-800 hover:text-coffee-600 line-clamp-1"
                              >
                                {rental.title}
                              </Link>
                              <p className="text-sm text-coffee-600 line-clamp-1">
                                {rental.author}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-coffee-700">
                          {new Date(rental.created_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-coffee-700">
                          {rental.rental_days} วัน
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-coffee-800">
                            ฿{rental.price_paid}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(rental)}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/books/${rental.book_id}`}
                            className="text-sm text-coffee-600 hover:text-coffee-700 font-medium"
                          >
                            ดูรายละเอียด →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {rentals.map((rental) => (
                <div key={rental.rental_id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="relative w-24 h-32 bg-coffee-100 flex-shrink-0">
                      <Image
                        src={rental.cover_image || '/placeholder-book.jpg'}
                        alt={rental.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-2">
                        {getStatusBadge(rental)}
                      </div>
                      <Link
                        href={`/books/${rental.book_id}`}
                        className="font-semibold text-coffee-800 hover:text-coffee-600 line-clamp-2 mb-1"
                      >
                        {rental.title}
                      </Link>
                      <p className="text-sm text-coffee-600 mb-3">{rental.author}</p>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-coffee-500">วันที่เช่า:</span>
                          <span className="text-coffee-700">
                            {new Date(rental.created_at).toLocaleDateString('th-TH', {
                              day: 'numeric',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-coffee-500">ระยะเวลา:</span>
                          <span className="text-coffee-700">{rental.rental_days} วัน</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-coffee-600">ราคา:</span>
                          <span className="text-coffee-800">฿{rental.price_paid}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/books/${rental.book_id}`}
                        className="mt-3 block text-center text-sm text-coffee-600 hover:text-coffee-700 font-medium"
                      >
                        ดูรายละเอียด →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← ก่อนหน้า
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            page === currentPage
                              ? 'bg-coffee-600 text-white'
                              : 'bg-white border border-coffee-300 text-coffee-700 hover:bg-coffee-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="w-10 h-10 flex items-center justify-center">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป →
                </button>
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-coffee-800 mb-4">สรุปการใช้งาน</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-coffee-700">
                    {pagination?.total || 0}
                  </div>
                  <div className="text-sm text-coffee-600">เช่าทั้งหมด</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coffee-700">
                    {rentals.filter(r => r.status === 'extended').length}
                  </div>
                  <div className="text-sm text-coffee-600">ต่ออายุแล้ว</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coffee-700">
                    ฿{rentals.reduce((sum, r) => sum + parseFloat(r.price_paid), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-coffee-600">ใช้จ่ายทั้งหมด</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coffee-700">
                    {Math.round(rentals.reduce((sum, r) => sum + r.rental_days, 0) / rentals.length) || 0}
                  </div>
                  <div className="text-sm text-coffee-600">เฉลี่ยวัน/เล่ม</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}