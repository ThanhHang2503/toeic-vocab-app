package com.toeic.word;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "*") // Allow frontend to call API
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }

    @GetMapping("/{id}")
    public Word getWordById(@PathVariable Long id) {
        return wordService.getWordById(id);
    }

    @GetMapping("/topic/{topicId}")
    public List<Word> getWordsByTopic(@PathVariable Long topicId) {
        return wordService.getWordsByTopic(topicId);
    }

    @PostMapping
    public ResponseEntity<Word> createWord(
            @RequestParam("word") String word,
            @RequestParam("meaning") String meaning,
            @RequestParam("example") String example,
            @RequestParam(value = "pronunciation", required = false) String pronunciation,
            @RequestParam("topicId") Long topicId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Word created = wordService.createWord(word, meaning, example, pronunciation, topicId, image);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        wordService.deleteWord(id);
        return ResponseEntity.ok().build();
    }
}
