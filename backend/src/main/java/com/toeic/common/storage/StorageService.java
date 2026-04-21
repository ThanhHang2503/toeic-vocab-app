package com.toeic.common.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    /**
     * Lưu trữ tệp tin vào một danh mục cụ thể với logic đặt tên và đánh số STT.
     * 
     * @param file Tệp tin tải lên
     * @param category Tên danh mục (đã được chuẩn hóa)
     * @return Đường dẫn tương đối của file sau khi lưu (ví dụ: category/file_1.jpg)
     * @throws IOException Nếu có lỗi trong quá trình lưu tệp
     */
    String store(MultipartFile file, String category) throws IOException;
    
    /**
     * Khởi tạo các thư mục cần thiết.
     */
    void init();
}
