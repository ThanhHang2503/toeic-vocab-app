package com.toeic.word;

import com.toeic.topic.Topic;
import com.toeic.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class WordService {

    private final WordRepository wordRepository;
    private final TopicRepository topicRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public WordService(WordRepository wordRepository, TopicRepository topicRepository) {
        this.wordRepository = wordRepository;
        this.topicRepository = topicRepository;
    }

    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    public Word getWordById(Long id) {
        return wordRepository.findById(id).orElseThrow(() -> new RuntimeException("Word not found"));
    }

    public List<Word> getWordsByTopic(Long topicId) {
        return wordRepository.findByTopicId(topicId);
    }

    public Word createWord(String wordText, String meaning, String example, String pronunciation, Long topicId, MultipartFile file) throws IOException {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        String imagePath = null;
        if (file != null && !file.isEmpty()) {
            imagePath = saveFile(file);
        }

        Word word = Word.builder()
                .word(wordText)
                .meaning(meaning)
                .example(example)
                .pronunciation(pronunciation)
                .imagePath(imagePath)
                .topic(topic)
                .build();

        return wordRepository.save(word);
    }

    public void deleteWord(Long id) {
        wordRepository.deleteById(id);
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), root.resolve(fileName));
        
        return fileName;
    }
}
