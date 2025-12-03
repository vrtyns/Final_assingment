import Link from 'next/link';
import Image from 'next/image';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.book_id}`}>
      <div className="card overflow-hidden group h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-64 bg-coffee-100 overflow-hidden">
          <Image
            src={book.cover_image || '/placeholder-book.jpg'}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="badge badge-primary backdrop-blur-sm bg-white/90">
              {book.category}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-semibold text-coffee-800">
              {/* แก้จาก: {book.rating?.toFixed(1) || '0.0'}
              เป็น: */}
              {Number(book.rating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-coffee-800 mb-1 line-clamp-2 group-hover:text-coffee-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-coffee-600 mb-3">{book.author}</p>
          
          {book.description && (
            <p className="text-sm text-coffee-500 line-clamp-2 mb-4 flex-1">
              {book.description}
            </p>
          )}

          {/* Pricing */}
          <div className="mt-auto border-t border-coffee-100 pt-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-coffee-500">เช่า 7 วัน</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-coffee-700">
                    ฿{book.rental_price_7days}
                  </span>
                  <span className="text-sm text-coffee-400 line-through">
                    ฿{book.full_price}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-coffee-500">เช่า {book.total_rentals || 0} ครั้ง</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}