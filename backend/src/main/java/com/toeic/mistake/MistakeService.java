package com.toeic.mistake;

import com.toeic.word.Word;
import com.toeic.word.WordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MistakeService {

    private final MistakeRepository mistakeRepository;
    private final WordRepository wordRepository;

    public MistakeService(MistakeRepository mistakeRepository, WordRepository wordRepository) {
        this.mistakeRepository = mistakeRepository;
        this.wordRepository = wordRepository;
    }

    public List<Mistake> getAllMistakes() {
        return mistakeRepository.findAll();
    }

    public Mistake createMistake(Long wordId, String wrongAnswer) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new RuntimeException("Word not found"));

        Mistake mistake = Mistake.builder()
                .word(word)
                .wrongAnswer(wrongAnswer)
                .build();

        return mistakeRepository.save(mistake);
    }

    public void deleteMistake(Long id) {
        mistakeRepository.deleteById(id);
    }
}
