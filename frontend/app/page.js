'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import { booksAPI } from '@/lib/api';

export default function Home() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [booksData, categoriesData] = await Promise.all([
        booksAPI.getPopular(8),
        booksAPI.getCategories(),
      ]);
      setPopularBooks(booksData.data);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-coffee-700 via-coffee-600 to-coffee-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              เช่า E-book
              <br />
              <span className="text-coffee-200">ราคาประหยัด</span>
            </h1>
            <p className="text-xl md:text-2xl text-coffee-100 mb-8 animate-fade-in">
              อ่านหนังสือดีๆ ไม่ต้องซื้อราคาแพง
              <br />
              เริ่มต้นเพียง 7 วัน เช่าได้ทันที
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link href="/books" className="btn-primary bg-white text-coffee-700 hover:bg-coffee-50">
                เริ่มเลือกหนังสือ
              </Link>
              <Link href="/register" className="btn-secondary border-2 border-white text-white hover:bg-white/10">
                สมัครสมาชิกฟรี
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-coffee-800 mb-2">ราคาประหยัด</h3>
              <p className="text-coffee-600">
                เช่าราคาเพียง 30-50% ของราคาซื้อขาด
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-coffee-800 mb-2">อ่านได้ทันที</h3>
              <p className="text-coffee-600">
                เช่าและเริ่มอ่านได้ทันที ไม่ต้องรอ
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-coffee-800 mb-2">หนังสือหลากหลาย</h3>
              <p className="text-coffee-600">
                มีหนังสือให้เลือกมากกว่า 50+ เล่ม
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-coffee-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
              หมวดหมู่หนังสือ
            </h2>
            <p className="text-coffee-600">เลือกอ่านตามความสนใจของคุณ</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-coffee-200 border-t-coffee-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.category}
                  href={`/books?category=${category.category}`}
                  className="card p-6 text-center hover:bg-coffee-100 transition-colors"
                >
                  <div className="text-4xl mb-3">📖</div>
                  <h3 className="font-semibold text-coffee-800 mb-1">
                    {category.category}
                  </h3>
                  <p className="text-sm text-coffee-600">
                    {category.count} เล่ม
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-2">
                หนังสือยอดนิยม
              </h2>
              <p className="text-coffee-600">หนังสือที่ถูกเช่ามากที่สุด</p>
            </div>
            <Link
              href="/books?sort=popular"
              className="text-coffee-600 hover:text-coffee-700 font-medium"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-coffee-200 border-t-coffee-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBooks.map((book) => (
                <BookCard key={book.book_id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-coffee-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            พร้อมเริ่มอ่านหนังสือแล้วหรือยัง?
          </h2>
          <p className="text-xl text-coffee-100 mb-8">
            สมัครสมาชิกฟรี เริ่มเช่าหนังสือได้ทันที
          </p>
          <Link href="/register" className="btn-primary bg-white text-coffee-700 hover:bg-coffee-50">
            สมัครสมาชิกเลย
          </Link>
        </div>
      </section>
    </div>
  );
}