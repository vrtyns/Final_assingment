const db = require('../config/db');

// Get all books with filters and pagination
exports.getAllBooks = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      sort = 'popular', 
      page = 1, 
      limit = 12 
    } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    // Filter by category
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Search by title or author
    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query += ' ORDER BY total_rentals DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'price_low':
        query += ' ORDER BY rental_price_7days ASC';
        break;
      case 'price_high':
        query += ' ORDER BY rental_price_7days DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      default:
        query += ' ORDER BY total_rentals DESC';
    }

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [books] = await db.query(query, params);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ'
    });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const [books] = await db.query(
      'SELECT * FROM books WHERE book_id = ?',
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบหนังสือที่ต้องการ'
      });
    }

    // Get reviews for this book
    const [reviews] = await db.query(
      `SELECT r.*, u.full_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.book_id = ? 
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        book: books[0],
        reviews
      }
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ'
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT category, COUNT(*) as count 
       FROM books 
       GROUP BY category 
       ORDER BY category`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
    });
  }
};

// Get popular books
exports.getPopularBooks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [books] = await db.query(
      'SELECT * FROM books ORDER BY total_rentals DESC LIMIT ?',
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get popular books error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือยอดนิยม'
    });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { book_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.user_id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาให้คะแนนระหว่าง 1-5'
      });
    }

    // Check if user has already reviewed
    const [existing] = await db.query(
      'SELECT * FROM reviews WHERE user_id = ? AND book_id = ?',
      [user_id, book_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'คุณได้รีวิวหนังสือเล่มนี้แล้ว'
      });
    }

    // Insert review
    await db.query(
      'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, book_id, rating, comment]
    );

    // Update book rating
    const [ratingResult] = await db.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE book_id = ?',
      [book_id]
    );

    await db.query(
      'UPDATE books SET rating = ? WHERE book_id = ?',
      [ratingResult[0].avg_rating, book_id]
    );

    res.status(201).json({
      success: true,
      message: 'เพิ่มรีวิวสำเร็จ'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว'
    });
  }
};