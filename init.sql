-- ===================================
-- สร้าง Database และ Tables
-- ===================================

CREATE DATABASE IF NOT EXISTS booklease CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE booklease;

-- ตาราง users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง books
CREATE TABLE books (
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

-- ตาราง rentals
CREATE TABLE rentals (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rental_start DATE NOT NULL,
    rental_end DATE NOT NULL,
    rental_days INT NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'expired', 'extended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- ตาราง payments
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(rental_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ตาราง reviews
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    UNIQUE KEY unique_user_book (user_id, book_id)
);

-- ===================================
-- Seed Data - 50+ Books
-- ===================================

-- ===================================
-- Seed Data - Books Only (50 books)
-- ===================================

USE booklease;

-- Clear existing data if needed
-- DELETE FROM books;

-- Programming & Tech (15 books)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Clean Code', 'Robert C. Martin', 'Programming', 'A Handbook of Agile Software Craftsmanship - เรียนรู้หลักการเขียนโค้ดที่สะอาดและบำรุงรักษาง่าย', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 890.00, 89.00, 149.00, 249.00, 4.8, 245);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('JavaScript: The Good Parts', 'Douglas Crockford', 'Programming', 'เจาะลึกส่วนที่ดีของ JavaScript และหลีกเลี่ยงจุดอ่อน', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400', 650.00, 65.00, 109.00, 189.00, 4.6, 189);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Python Crash Course', 'Eric Matthes', 'Programming', 'คู่มือเริ่มต้น Python สำหรับผู้เริ่มต้น พร้อมโปรเจคจริง', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', 790.00, 79.00, 132.00, 229.00, 4.7, 312);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Design Patterns', 'Gang of Four', 'Programming', 'Elements of Reusable Object-Oriented Software', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 920.00, 92.00, 154.00, 269.00, 4.5, 156);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Pragmatic Programmer', 'Andrew Hunt', 'Programming', 'Your Journey to Mastery - แนวทางการเป็นโปรแกรมเมอร์มืออาชีพ', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400', 850.00, 85.00, 142.00, 249.00, 4.9, 278);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Node.js Design Patterns', 'Mario Casciaro', 'Programming', 'เรียนรู้ design patterns สำหรับ Node.js แบบเจาะลึก', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400', 780.00, 78.00, 131.00, 229.00, 4.4, 167);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('React Up & Running', 'Stoyan Stefanov', 'Programming', 'Building Web Applications with React', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 720.00, 72.00, 121.00, 209.00, 4.5, 198);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('MySQL for Developers', 'Rick Silva', 'Database', 'เจาะลึก MySQL สำหรับนักพัฒนา พร้อม best practices', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400', 690.00, 69.00, 116.00, 199.00, 4.3, 134);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Git Pro', 'Scott Chacon', 'Programming', 'Everything you need to know about Git version control', 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400', 580.00, 58.00, 97.00, 169.00, 4.6, 223);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Web Performance in Action', 'Jeremy Wagner', 'Web Development', 'Building Fast Web Pages - เทคนิคเพิ่มความเร็วเว็บไซต์', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 750.00, 75.00, 126.00, 219.00, 4.4, 145);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('CSS in Depth', 'Keith J. Grant', 'Web Development', 'เจาะลึก CSS สมัยใหม่ พร้อมเทคนิคขั้นสูง', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400', 680.00, 68.00, 114.00, 199.00, 4.5, 178);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('API Design Patterns', 'JJ Geewax', 'Programming', 'Best practices in API design and implementation', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 820.00, 82.00, 138.00, 239.00, 4.6, 142);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Docker Deep Dive', 'Nigel Poulton', 'DevOps', 'Zero to Docker in a single book - เรียนรู้ Docker แบบเจาะลึก', 'https://images.unsplash.com/photo-1605745341075-d29b8c80c93f?w=400', 790.00, 79.00, 132.00, 229.00, 4.7, 189);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Kubernetes in Action', 'Marko Luksa', 'DevOps', 'Learn Kubernetes container orchestration', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400', 890.00, 89.00, 149.00, 259.00, 4.5, 156);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Microservices Patterns', 'Chris Richardson', 'Architecture', 'Building scalable systems with microservices', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', 920.00, 92.00, 154.00, 269.00, 4.6, 134);

-- Business & Entrepreneurship (12 books)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Lean Startup', 'Eric Ries', 'Business', 'How to build a successful startup with validated learning', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400', 550.00, 55.00, 92.00, 159.00, 4.8, 456);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Zero to One', 'Peter Thiel', 'Business', 'Notes on Startups, or How to Build the Future', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 590.00, 59.00, 99.00, 169.00, 4.7, 389);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Good to Great', 'Jim Collins', 'Business', 'Why Some Companies Make the Leap and Others Don''t', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 620.00, 62.00, 104.00, 179.00, 4.6, 334);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Hard Thing About Hard Things', 'Ben Horowitz', 'Business', 'Building a Business When There Are No Easy Answers', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', 580.00, 58.00, 97.00, 169.00, 4.7, 298);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Rework', 'Jason Fried', 'Business', 'Change the way you work forever - มุมมองใหม่ของการทำงาน', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', 520.00, 52.00, 87.00, 149.00, 4.5, 267);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The E-Myth Revisited', 'Michael E. Gerber', 'Business', 'Why Most Small Businesses Don''t Work', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', 560.00, 56.00, 94.00, 159.00, 4.6, 245);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Start with Why', 'Simon Sinek', 'Business', 'How Great Leaders Inspire Everyone to Take Action', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', 540.00, 54.00, 90.00, 155.00, 4.8, 412);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Blue Ocean Strategy', 'W. Chan Kim', 'Business', 'How to Create Uncontested Market Space', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', 650.00, 65.00, 109.00, 189.00, 4.5, 289);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Innovator''s Dilemma', 'Clayton Christensen', 'Business', 'When New Technologies Cause Great Firms to Fail', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400', 680.00, 68.00, 114.00, 199.00, 4.6, 234);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Hooked', 'Nir Eyal', 'Business', 'How to Build Habit-Forming Products', 'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400', 590.00, 59.00, 99.00, 169.00, 4.7, 345);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Crossing the Chasm', 'Geoffrey A. Moore', 'Business', 'Marketing and Selling High-Tech Products', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', 620.00, 62.00, 104.00, 179.00, 4.4, 198);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Mom Test', 'Rob Fitzpatrick', 'Business', 'How to talk to customers and learn if your business is a good idea', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400', 490.00, 49.00, 82.00, 139.00, 4.8, 276);

-- Self-Help & Productivity (10 books)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Atomic Habits', 'James Clear', 'Self-Help', 'An Easy & Proven Way to Build Good Habits', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 520.00, 52.00, 87.00, 149.00, 4.9, 567);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Deep Work', 'Cal Newport', 'Productivity', 'Rules for Focused Success in a Distracted World', 'https://images.unsplash.com/photo-1483546363825-7ebf25fb7513?w=400', 540.00, 54.00, 90.00, 155.00, 4.7, 445);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The 7 Habits of Highly Effective People', 'Stephen Covey', 'Self-Help', 'Powerful Lessons in Personal Change', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', 580.00, 58.00, 97.00, 169.00, 4.8, 523);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 'The two systems that drive the way we think', 'https://images.unsplash.com/photo-1473090928189-364b2c4e1eed?w=400', 650.00, 65.00, 109.00, 189.00, 4.6, 389);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Getting Things Done', 'David Allen', 'Productivity', 'The Art of Stress-Free Productivity', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400', 560.00, 56.00, 94.00, 159.00, 4.5, 312);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Power of Habit', 'Charles Duhigg', 'Self-Help', 'Why We Do What We Do in Life and Business', 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400', 540.00, 54.00, 90.00, 155.00, 4.7, 456);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Essentialism', 'Greg McKeown', 'Productivity', 'The Disciplined Pursuit of Less', 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400', 520.00, 52.00, 87.00, 149.00, 4.6, 334);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Mindset', 'Carol S. Dweck', 'Psychology', 'The New Psychology of Success', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 550.00, 55.00, 92.00, 159.00, 4.8, 398);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'Self-Help', 'A Counterintuitive Approach to Living a Good Life', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400', 490.00, 49.00, 82.00, 139.00, 4.5, 489);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Make Time', 'Jake Knapp', 'Productivity', 'How to Focus on What Matters Every Day', 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400', 510.00, 51.00, 85.00, 145.00, 4.6, 289);

-- Fiction & Literature (8 books)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Midnight Library', 'Matt Haig', 'Fiction', 'A Novel about infinite possibilities and choices', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 450.00, 45.00, 75.00, 129.00, 4.7, 412);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Project Hail Mary', 'Andy Weir', 'Science Fiction', 'A lone astronaut must save Earth', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', 480.00, 48.00, 80.00, 139.00, 4.8, 456);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'Fiction', 'A Hollywood icon tells her story', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 420.00, 42.00, 70.00, 119.00, 4.6, 378);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Where the Crawdads Sing', 'Delia Owens', 'Fiction', 'A coming-of-age story with a twist', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 440.00, 44.00, 73.00, 125.00, 4.7, 501);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Klara and the Sun', 'Kazuo Ishiguro', 'Science Fiction', 'A touching story about AI and humanity', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400', 460.00, 46.00, 77.00, 132.00, 4.5, 289);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Invisible Life of Addie LaRue', 'V.E. Schwab', 'Fantasy', 'A girl cursed to be forgotten', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400', 470.00, 47.00, 78.00, 135.00, 4.6, 334);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Educated', 'Tara Westover', 'Memoir', 'A Memoir of self-invention and the pursuit of education', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 490.00, 49.00, 82.00, 139.00, 4.8, 445);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Song of Achilles', 'Madeline Miller', 'Historical Fiction', 'A retelling of the Iliad from Patroclus perspective', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 450.00, 45.00, 75.00, 129.00, 4.7, 398);

-- Design & Creativity (5 books)
INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Steal Like an Artist', 'Austin Kleon', 'Creativity', '10 Things Nobody Told You About Being Creative', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400', 380.00, 38.00, 63.00, 109.00, 4.6, 345);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('The Design of Everyday Things', 'Don Norman', 'Design', 'Revised and Expanded Edition', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400', 620.00, 62.00, 104.00, 179.00, 4.7, 267);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Don''t Make Me Think', 'Steve Krug', 'UX Design', 'A Common Sense Approach to Web Usability', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 580.00, 58.00, 97.00, 169.00, 4.8, 298);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Refactoring UI', 'Adam Wathan', 'Design', 'Learn how to design beautiful user interfaces', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', 750.00, 75.00, 126.00, 219.00, 4.9, 312);

INSERT INTO books (title, author, category, description, cover_image, full_price, rental_price_7days, rental_price_14days, rental_price_30days, rating, total_rentals) VALUES
('Logo Design Love', 'David Airey', 'Design', 'A Guide to Creating Iconic Brand Identities', 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400', 690.00, 69.00, 116.00, 199.00, 4.5, 234);

-- Success message
SELECT 'Database seeded successfully!' AS message, COUNT(*) AS total_books FROM books;
-- ===================================
-- Seed Data - Sample Users
-- ===================================

-- Password: "password123" (ในการใช้งานจริงควร hash ด้วย bcrypt)
INSERT INTO users (email, password, full_name, phone) VALUES
('john.doe@example.com', '$2b$10$rqQQQQQQQQQQQQQQQQQQQuK7jK7jK7jK7jK7jK7jK7jK7jK7jK7jK', 'John Doe', '0812345678'),
('jane.smith@example.com', '$2b$10$rqQQQQQQQQQQQQQQQQQQQuK7jK7jK7jK7jK7jK7jK7jK7jK7jK7jK', 'Jane Smith', '0823456789'),
('admin@booklease.com', '$2b$10$rqQQQQQQQQQQQQQQQQQQQuK7jK7jK7jK7jK7jK7jK7jK7jK7jK7jK', 'Admin User', '0891234567');