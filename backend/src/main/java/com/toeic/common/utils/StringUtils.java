package com.toeic.common.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class StringUtils {

    public static String slugify(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        // 1. Chuyển sang chữ thường
        String normalized = input.toLowerCase();

        // 2. Loại bỏ dấu tiếng Việt
        normalized = Normalizer.normalize(normalized, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        normalized = pattern.matcher(normalized).replaceAll("");

        // Thay các ký tự đặc biệt tiếng Việt khác (đ, ...)
        normalized = normalized.replaceAll("đ", "d");

        // 3. Thay thế khoảng trắng và ký tự không phải chữ/số thành dấu gạch ngang
        normalized = normalized.replaceAll("[^a-z0-9\\s]", "");
        normalized = normalized.replaceAll("\\s+", "-");

        // 4. Loại bỏ các dấu gạch ngang ở đầu và cuối
        normalized = normalized.replaceAll("^-+|-+$", "");

        return normalized;
    }
}
