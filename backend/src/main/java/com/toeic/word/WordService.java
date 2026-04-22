package com.toeic.word;

import com.toeic.common.storage.StorageService;
import com.toeic.common.utils.StringUtils;
import com.toeic.topic.Topic;
import com.toeic.topic.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class WordService {

    private final WordRepository wordRepository;
    private final TopicRepository topicRepository;
    private final StorageService storageService;

    public WordService(WordRepository wordRepository, TopicRepository topicRepository, StorageService storageService) {
        this.wordRepository = wordRepository;
        this.topicRepository = topicRepository;
        this.storageService = storageService;
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
            // 1. Chuẩn hóa tên danh mục (slugify)
            String slugifiedCategory = StringUtils.slugify(topic.getName());
            
            // 2. Lưu file thông qua StorageService (tự động xử lý STT và thư mục con)
            imagePath = storageService.store(file, slugifiedCategory);
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

    public Word updateWord(Long id, String wordText, String meaning, String example, String pronunciation, Long topicId, MultipartFile file) throws IOException {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Word not found"));
        
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        if (file != null && !file.isEmpty()) {
            String slugifiedCategory = StringUtils.slugify(topic.getName());
            String imagePath = storageService.store(file, slugifiedCategory);
            word.setImagePath(imagePath);
        }

        word.setWord(wordText);
        word.setMeaning(meaning);
        word.setExample(example);
        word.setPronunciation(pronunciation);
        word.setTopic(topic);

        return wordRepository.save(word);
    }

    public void deleteWord(Long id) {
        wordRepository.deleteById(id);
    }

    public Word updateStatus(Long id, String status) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Word not found"));
        word.setStatus(status);
        return wordRepository.save(word);
    }
}
