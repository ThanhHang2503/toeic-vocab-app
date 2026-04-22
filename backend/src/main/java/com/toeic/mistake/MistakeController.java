package com.toeic.mistake;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mistakes")
@CrossOrigin(origins = "*")
public class MistakeController {

    private final MistakeService mistakeService;

    public MistakeController(MistakeService mistakeService) {
        this.mistakeService = mistakeService;
    }

    @GetMapping
    public List<Mistake> getAllMistakes() {
        return mistakeService.getAllMistakes();
    }

    @PostMapping
    public ResponseEntity<Mistake> createMistake(@RequestBody Map<String, Object> payload) {
        Long wordId = Long.valueOf(payload.get("wordId").toString());
        String wrongAnswer = payload.get("wrongAnswer").toString();
        return ResponseEntity.ok(mistakeService.createMistake(wordId, wrongAnswer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable Long id) {
        mistakeService.deleteMistake(id);
        return ResponseEntity.ok().build();
    }
}
