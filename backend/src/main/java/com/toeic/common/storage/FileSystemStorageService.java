package com.toeic.common.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    public FileSystemStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @Override
    public String store(MultipartFile file, String category) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        // 1. Tạo thư mục danh mục nếu chưa có
        Path categoryDir = this.rootLocation.resolve(category);
        if (!Files.exists(categoryDir)) {
            Files.createDirectories(categoryDir);
        }

        // 2. Lấy extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".jpg"; // Mặc định nếu không có extension
        }

        // 3. Tìm số thứ tự stt khả dụng
        int stt = 1;
        String fileName;
        Path destinationFile;
        
        do {
            fileName = category + "_" + stt + extension;
            destinationFile = categoryDir.resolve(fileName);
            stt++;
        } while (Files.exists(destinationFile));

        // 4. Lưu file
        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }

        // Trả về đường dẫn tương đối để lưu vào DB (ví dụ: cong-so/cong-so_1.jpg)
        return category + "/" + fileName;
    }
}
