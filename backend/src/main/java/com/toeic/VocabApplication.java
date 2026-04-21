package com.toeic;

import com.toeic.common.storage.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@SpringBootApplication
public class VocabApplication {
    public static void main(String[] args) {
        SpringApplication.run(VocabApplication.class, args);
    }

    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer(@Value("${app.upload.dir:uploads}") String uploadDir) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                String path = Paths.get(uploadDir).toAbsolutePath().toUri().toString();
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations(path);
            }
        };
    }
}
