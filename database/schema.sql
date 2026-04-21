CREATE DATABASE IF NOT EXISTS `toeic_db`;
USE `toeic_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. Table: topics (Chủ đề học tập)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `topics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table: vocabulary (Từ vựng)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vocabulary` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `topic_id` BIGINT NOT NULL,
    `word` VARCHAR(100) NOT NULL,
    `meaning` TEXT NOT NULL,
    `example` TEXT NOT NULL,
    `pronunciation` VARCHAR(255),
    `image_path` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_vocab_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table: mistakes (Lịch sử lỗi sai)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mistakes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `word_id` BIGINT NOT NULL,
    `wrong_answer` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_mistake_vocab` FOREIGN KEY (`word_id`) REFERENCES `vocabulary` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;