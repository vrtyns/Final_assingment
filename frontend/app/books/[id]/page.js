'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RentalModal from '@/components/RentalModal';
import { booksAPI } from '@/lib/api';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    loadBookDetail();
  }, [params.id]);

  const loadBookDetail = async () => {
    try {
      setIsLoading(true);
      const data = await booksAPI.getById(params.id);
      setBook(data.data.book);
      setReviews(data.data.reviews);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentClick = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/books/' + params.id);
      return;
    }
    setShowRentalModal(true);
  };

  const handleRentalSuccess = () => {
    router.push('/my-library');
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

  if (!book) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-coffee-800 mb-2">ไม่พบหนังสือ</h2>
          <p className="text-coffee-600 mb-6">ขออภัย เราไม่พบหนังสือที่คุณต้องการ</p>
          <Link href="/books" className="btn-primary">
            กลับไปหน้ารายการหนังสือ
          </Link>
        </div>
      </div>
    );
  }

  const savings = book.full_price - book.rental_price_7days;
  const savingsPercent = ((savings / book.full_price) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-coffee-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-coffee-600 hover:text-coffee-700">หน้าแรก</Link>
          <span className="mx-2 text-coffee-400">/</span>
          <Link href="/books" className="text-coffee-600 hover:text-coffee-700">หนังสือทั้งหมด</Link>
          <span className="mx-2 text-coffee-400">/</span>
          <span className="text-coffee-800">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="relative h-96 bg-coffee-100">
                  <Image
                    src={book.cover_image || '/placeholder-book.jpg'}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Rental Pricing Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-coffee-800 mb-4">ราคาเช่า</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                    <span className="text-sm text-coffee-600">7 วัน</span>
                    <span className="font-bold text-coffee-800">฿{book.rental_price_7days}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                    <span className="text-sm text-coffee-600">14 วัน</span>
                    <span className="font-bold text-coffee-800">฿{book.rental_price_14days}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                    <span className="text-sm text-coffee-600">30 วัน</span>
                    <span className="font-bold text-coffee-800">฿{book.rental_price_30days}</span>
                  </div>
                </div>

                <div className="border-t border-coffee-100 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-coffee-600">ราคาซื้อขาด</span>
                    <span className="text-coffee-400 line-through">฿{book.full_price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">ประหยัดได้ถึง</span>
                    <span className="font-bold text-green-600">
                      ฿{savings.toFixed(2)} ({savingsPercent}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRentClick}
                  className="w-full btn-primary"
                >
                  เช่าหนังสือเล่มนี้
                </button>

                {!isLoggedIn && (
                  <p className="text-xs text-coffee-500 text-center mt-3">
                    * ต้องเข้าสู่ระบบก่อนเช่า
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-coffee-700">
                      {/* {book.rating?.toFixed(1) || '0.0'} */}
                        {Number(book.rating || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-coffee-600">⭐ คะแนน</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-coffee-700">
                      {book.total_rentals || 0}
                    </div>
                    <div className="text-sm text-coffee-600">ครั้งที่เช่า</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              {/* Title & Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-primary">{book.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold text-coffee-800">
                      {/* {book.rating?.toFixed(1) || '0.0'} */}
                        {Number(book.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-coffee-600">โดย {book.author}</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-coffee-800 mb-3">เกี่ยวกับหนังสือเล่มนี้</h2>
                <p className="text-coffee-700 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">💡 ข้อมูลเพิ่มเติม</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>✅ เช่าได้ทันที ไม่ต้องรอ</li>
                  <li>✅ อ่านได้บนทุกอุปกรณ์</li>
                  <li>✅ สามารถต่ออายุการเช่าได้</li>
                  <li>✅ ราคาประหยัดกว่าซื้อขาด {savingsPercent}%</li>
                </ul>
              </div>
            </div>
            {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-coffee-800 mb-6">
            รีวิวจากผู้อ่าน ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-coffee-600">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวหนังสือเล่มนี้!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b border-coffee-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-coffee-800">{review.full_name}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-500' : 'text-coffee-200'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-coffee-500">
                      {new Date(review.created_at).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-coffee-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Rental Modal */}
  <RentalModal
    book={book}
    isOpen={showRentalModal}
    onClose={() => setShowRentalModal(false)}
    onSuccess={handleRentalSuccess}
  />
</div>
);
}