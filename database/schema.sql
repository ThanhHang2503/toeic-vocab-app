CREATE DATABASE IF NOT EXISTS `toeic_db`;
USE `toeic_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. Table: users (Người dùng)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'ID duy nhất của người dùng',
    `email` VARCHAR(255) NOT NULL COMMENT 'Email đăng nhập',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa',
    `username` VARCHAR(100) NOT NULL COMMENT 'Tên hiển thị',
    `avatar_url` TEXT COMMENT 'Link ảnh đại diện',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật cuối cùng',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_email` (`email`),
    UNIQUE KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý thông tin người dùng';

-- ----------------------------------------------------------
-- 2. Table: topics (Chủ đề học tập)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `topics` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'ID duy nhất của chủ đề',
    `user_id` CHAR(36) NOT NULL COMMENT 'ID người sở hữu chủ đề',
    `name` VARCHAR(100) NOT NULL COMMENT 'Tên chủ đề (ví dụ: Office, Travel)',
    `description` TEXT COMMENT 'Mô tả chi tiết về chủ đề',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_topics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `unique_user_topic` UNIQUE (`user_id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý các chủ đề từ vựng';

-- ----------------------------------------------------------
-- 3. Table: vocabulary (Từ vựng)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vocabulary` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'ID duy nhất của từ vựng',
    `topic_id` CHAR(36) NOT NULL COMMENT 'Thuộc chủ đề nào',
    `user_id` CHAR(36) NOT NULL COMMENT 'Người tạo từ vựng này',
    `word` VARCHAR(100) NOT NULL COMMENT 'Từ vựng tiếng Anh',
    `meaning` TEXT NOT NULL COMMENT 'Nghĩa tiếng Việt',
    `example` TEXT NOT NULL COMMENT 'Câu ví dụ bắt buộc',
    `image_url` TEXT COMMENT 'Link ảnh minh họa cho từ',
    `pronunciation` VARCHAR(255) COMMENT 'Phiên âm (IPA)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_vocab_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_vocab_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    -- Ràng buộc: Câu ví dụ phải chứa từ vựng (không phân biệt hoa thường)
    CONSTRAINT `check_example_contains_word` CHECK (LOCATE(LOWER(`word`), LOWER(`example`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ từ vựng chi tiết';

-- ----------------------------------------------------------
-- 4. Table: test_sessions (Phiên kiểm tra)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test_sessions` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'ID duy nhất của phiên test',
    `user_id` CHAR(36) NOT NULL COMMENT 'Người thực hiện bài test',
    `topic_id` CHAR(36) NOT NULL COMMENT 'Test cho chủ đề nào',
    `total_questions` INT DEFAULT 0 COMMENT 'Tổng số câu hỏi trong phiên',
    `correct_answers` INT DEFAULT 0 COMMENT 'Số câu trả lời đúng',
    `score` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Điểm số (tính theo thang 10 hoặc 100)',
    `started_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm bắt đầu',
    `completed_at` TIMESTAMP NULL COMMENT 'Thời điểm hoàn thành (NULL nếu chưa xong)',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_test_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_test_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng ghi lại các phiên làm bài kiểm tra';

-- ----------------------------------------------------------
-- 5. Table: mistakes (Lịch sử lỗi sai)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mistakes` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'ID duy nhất của bản ghi lỗi',
    `user_id` CHAR(36) NOT NULL COMMENT 'Người mắc lỗi',
    `vocab_id` CHAR(36) NOT NULL COMMENT 'Từ bị sai',
    `topic_id` CHAR(36) NOT NULL COMMENT 'Chủ đề của từ đó',
    `test_session_id` CHAR(36) NOT NULL COMMENT 'Thuộc phiên test nào',
    `wrong_answer` TEXT NOT NULL COMMENT 'Câu trả lời sai đã nhập',
    `correct_answer` VARCHAR(255) NOT NULL COMMENT 'Đáp án đúng tại thời điểm đó',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi nhận lỗi',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_mistake_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mistake_vocab` FOREIGN KEY (`vocab_id`) REFERENCES `vocabulary` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mistake_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mistake_session` FOREIGN KEY (`test_session_id`) REFERENCES `test_sessions` (`id`) ON DELETE CASCADE,
    -- Ràng buộc: Không lưu trùng lỗi cho cùng một từ trong cùng một phiên test
    CONSTRAINT `unique_session_vocab_mistake` UNIQUE (`test_session_id`, `vocab_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu lại lịch sử các từ bị làm sai để review';

-- ----------------------------------------------------------
-- INDEXES (Chỉ mục tối ưu hóa truy vấn)
-- ----------------------------------------------------------

-- Topics
CREATE INDEX `idx_topics_user_id` ON `topics` (`user_id`);
CREATE INDEX `idx_topics_name` ON `topics` (`name`);

-- Vocabulary
CREATE INDEX `idx_vocab_topic_id` ON `vocabulary` (`topic_id`);
CREATE INDEX `idx_vocab_user_id` ON `vocabulary` (`user_id`);
CREATE INDEX `idx_vocab_word` ON `vocabulary` (`word`);
-- Fulltext search cho tìm kiếm từ vựng linh hoạt
CREATE FULLTEXT INDEX `idx_ft_vocab_search` ON `vocabulary` (`word`, `meaning`, `example`);

-- Test Sessions
CREATE INDEX `idx_test_user_id` ON `test_sessions` (`user_id`);
CREATE INDEX `idx_test_topic_id` ON `test_sessions` (`topic_id`);
CREATE INDEX `idx_test_completed_at` ON `test_sessions` (`completed_at`);

-- Mistakes
CREATE INDEX `idx_mistakes_user_id` ON `mistakes` (`user_id`);
CREATE INDEX `idx_mistakes_vocab_id` ON `mistakes` (`vocab_id`);
CREATE INDEX `idx_mistakes_topic_id` ON `mistakes` (`topic_id`);
CREATE INDEX `idx_mistakes_session_id` ON `mistakes` (`test_session_id`);
CREATE INDEX `idx_mistakes_created_at` ON `mistakes` (`created_at`);

SET FOREIGN_KEY_CHECKS = 1;