CREATE DATABASE IF NOT EXISTS booklease CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE booklease;

-- Tables
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    cover_image VARCHAR(255),
    full_price DECIMAL(10,2) NOT NULL,
    rental_price_7days DECIMAL(10,2) NOT NULL,
    rental_price_14days DECIMAL(10,2) NOT NULL,
    rental_price_30days DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    total_rentals INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rentals (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rental_start DATE NOT NULL,
    rental_end DATE NOT NULL,
    rental_days INT NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'expired', 'extended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id)
);

-- Insert seed data (5 หนังสือตัวอย่าง)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Clean Code', 'Robert C. Martin', 'Programming', 'A Handbook of Agile Software Craftsmanship', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 890.00, 89.00, 149.00, 249.00, 4.8, 245),
('The Lean Startup', 'Eric Ries', 'Business', 'How to build a successful startup', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400', 550.00, 55.00, 92.00, 159.00, 4.8, 456),
('Atomic Habits', 'James Clear', 'Self-Help', 'An Easy & Proven Way to Build Good Habits', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 520.00, 52.00, 87.00, 149.00, 4.9, 567),
('The Midnight Library', 'Matt Haig', 'Fiction', 'A Novel about infinite possibilities', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 450.00, 45.00, 75.00, 129.00, 4.7, 412),
('Steal Like an Artist', 'Austin Kleon', 'Creativity', '10 Things Nobody Told You About Being Creative', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400', 380.00, 38.00, 63.00, 109.00, 4.6, 345);

-- Success message
SELECT 'Database initialized successfully!' AS message