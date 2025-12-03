'use client'; // ✅ ต้องมีบรรทัดนี้เสมอ

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '@/components/BookCard';
import { booksAPI } from '@/lib/api';

// 1. สร้าง Component ย่อยเพื่อเก็บ Logic และ UI เดิมของคุณ
function BooksContent() {
  // --- ส่วน Logic (ย้ายมาจากตัวเดิม) ---
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State เดิมของคุณ (ผมใส่ให้ครบตามที่ UI เรียกใช้)
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState([]); // สมมติว่ามีการดึงหมวดหมู่
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

// Filter states
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBooks();
    updateURL();
  }, [selectedCategory, searchQuery, sortBy, currentPage]);

  const loadCategories = async () => {
    try {
      const data = await booksAPI.getCategories();
      setCategories(data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (sortBy) params.sort = sortBy;

      const data = await booksAPI.getAll(params);
      setBooks(data.data.books);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    router.push(`/books${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };
  
  const handleSearch = (e) => { e.preventDefault(); /* logic ค้นหาของคุณ */ };
  const handleCategoryChange = (cat) => { setSelectedCategory(cat); /* logic */ };
  const handleSortChange = (sort) => { setSortBy(sort); /* logic */ };
  const clearFilters = () => { /* logic */ };

  // --- ส่วน UI (ที่คุณส่งมาเมื่อกี้) ---
  return (
    <div className="min-h-screen bg-coffee-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-2">
            หนังสือทั้งหมด
          </h1>
          <p className="text-coffee-600">
            เลือกหนังสือที่คุณสนใจและเริ่มเช่าได้เลย
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..."
                className="input-field pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-600 hover:text-coffee-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-coffee-700 mb-3">
              หมวดหมู่
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-coffee-600 text-white'
                    : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
                }`}
              >
                ทั้งหมด
              </button>
              {categories.map((category) => (
                <button
                  key={category.category}
                  onClick={() => handleCategoryChange(category.category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.category
                      ? 'bg-coffee-600 text-white'
                      : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
                  }`}
                >
                  {category.category} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Clear */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-coffee-700">
                เรียงตาม:
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field py-2"
              >
                <option value="popular">ยอดนิยม</option>
                <option value="rating">คะแนนสูงสุด</option>
                <option value="price_low">ราคาต่ำสุด</option>
                <option value="price_high">ราคาสูงสุด</option>
                <option value="newest">ใหม่ล่าสุด</option>
              </select>
            </div>

            {(selectedCategory || searchQuery || sortBy !== 'popular') && (
              <button
                onClick={clearFilters}
                className="text-sm text-coffee-600 hover:text-coffee-700 font-medium"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-coffee-200 border-t-coffee-600"></div>
            <p className="mt-4 text-coffee-600">กำลังโหลดหนังสือ...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-coffee-800 mb-2">
              ไม่พบหนังสือที่ค้นหา
            </h3>
            <p className="text-coffee-600 mb-6">
              ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะ
            </p>
            <button onClick={clearFilters} className="btn-primary">
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book.book_id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
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
          </>
        )}
      </div>
    </div>
  );
}

// 2. Main Component (หน้าที่แค่เอา Suspense มาห่อ)
export default function BooksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BooksContent />
    </Suspense>
  );
}