const db = require('../config/db');

// Create rental
exports.createRental = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { book_id, rental_days } = req.body;
    const user_id = req.user.user_id;

    // Validate rental days
    if (![7, 14, 30].includes(rental_days)) {
      return res.status(400).json({
        success: false,
        message: 'ระยะเวลาเช่าต้องเป็น 7, 14 หรือ 30 วัน'
      });
    }

    // Get book details
    const [books] = await connection.query(
      'SELECT * FROM books WHERE book_id = ?',
      [book_id]
    );

    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบหนังสือที่ต้องการ'
      });
    }

    const book = books[0];

    // Calculate price
    let price;
    if (rental_days === 7) price = book.rental_price_7days;
    else if (rental_days === 14) price = book.rental_price_14days;
    else price = book.rental_price_30days;

    // Calculate dates
    const rental_start = new Date();
    const rental_end = new Date();
    rental_end.setDate(rental_end.getDate() + rental_days);

    // Insert rental
    const [rentalResult] = await connection.query(
      `INSERT INTO rentals (user_id, book_id, rental_start, rental_end, rental_days, price_paid, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [user_id, book_id, rental_start, rental_end, rental_days, price]
    );

    const rental_id = rentalResult.insertId;

    // Insert payment
    await connection.query(
      `INSERT INTO payments (rental_id, user_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, 'credit_card', 'completed')`,
      [rental_id, user_id, price]
    );

    // Update book stats
    await connection.query(
      'UPDATE books SET total_rentals = total_rentals + 1 WHERE book_id = ?',
      [book_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'เช่าหนังสือสำเร็จ',
      data: {
        rental_id,
        book_title: book.title,
        rental_start,
        rental_end,
        rental_days,
        price_paid: price
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create rental error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเช่าหนังสือ'
    });
  } finally {
    connection.release();
  }
};

// Get user's active rentals
exports.getActiveRentals = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [rentals] = await db.query(
      `SELECT r.*, b.title, b.author, b.cover_image, b.category
       FROM rentals r
       JOIN books b ON r.book_id = b.book_id
       WHERE r.user_id = ? AND r.status = 'active' AND r.rental_end >= CURDATE()
       ORDER BY r.rental_end ASC`,
      [user_id]
    );

    res.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error('Get active rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเช่า'
    });
  }
};

// Get user's rental history
exports.getRentalHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { page = 1, limit = 10 } = req.query;

    // Count total
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM rentals WHERE user_id = ?',
      [user_id]
    );
    const total = countResult[0].total;

    // Get rentals with pagination
    const offset = (page - 1) * limit;
    const [rentals] = await db.query(
      `SELECT r.*, b.title, b.author, b.cover_image, b.category
       FROM rentals r
       JOIN books b ON r.book_id = b.book_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        rentals,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get rental history error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการเช่า'
    });
  }
};

// Extend rental
exports.extendRental = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { rental_id } = req.params;
    const { extend_days } = req.body;
    const user_id = req.user.user_id;

    // Validate extend days
    if (![7, 14, 30].includes(extend_days)) {
      return res.status(400).json({
        success: false,
        message: 'ระยะเวลาต่ออายุต้องเป็น 7, 14 หรือ 30 วัน'
      });
    }

    // Get rental details
    const [rentals] = await connection.query(
      `SELECT r.*, b.rental_price_7days, b.rental_price_14days, b.rental_price_30days
       FROM rentals r
       JOIN books b ON r.book_id = b.book_id
       WHERE r.rental_id = ? AND r.user_id = ?`,
      [rental_id, user_id]
    );

    if (rentals.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลการเช่า'
      });
    }

    const rental = rentals[0];

    // Calculate extend price
    let extend_price;
    if (extend_days === 7) extend_price = rental.rental_price_7days;
    else if (extend_days === 14) extend_price = rental.rental_price_14days;
    else extend_price = rental.rental_price_30days;

    // Update rental end date
    const new_end_date = new Date(rental.rental_end);
    new_end_date.setDate(new_end_date.getDate() + extend_days);

    await connection.query(
      `UPDATE rentals 
       SET rental_end = ?, 
           rental_days = rental_days + ?, 
           price_paid = price_paid + ?,
           status = 'extended'
       WHERE rental_id = ?`,
      [new_end_date, extend_days, extend_price, rental_id]
    );

    // Insert payment for extension
    await connection.query(
      `INSERT INTO payments (rental_id, user_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, 'credit_card', 'completed')`,
      [rental_id, user_id, extend_price]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'ต่ออายุการเช่าสำเร็จ',
      data: {
        new_end_date,
        extend_days,
        extend_price
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Extend rental error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการต่ออายุการเช่า'
    });
  } finally {
    connection.release();
  }
};

// Get rental statistics for user
exports.getRentalStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [stats] = await db.query(
      `SELECT 
         COUNT(*) as total_rentals,
         SUM(price_paid) as total_spent,
         COUNT(CASE WHEN status = 'active' AND rental_end >= CURDATE() THEN 1 END) as active_rentals
       FROM rentals
       WHERE user_id = ?`,
      [user_id]
    );

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get rental stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติการเช่า'
    });
  }
};