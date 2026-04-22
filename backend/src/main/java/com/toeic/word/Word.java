package com.toeic.word;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.toeic.topic.Topic;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vocabulary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT")
    private Long id;

    @Column(nullable = false)
    private String word;

    @Column(nullable = false)
    private String meaning;

    @Column(columnDefinition = "TEXT")
    private String example;

    private String pronunciation;

    @Column(name = "image_path")
    private String imagePath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false, columnDefinition = "BIGINT")
    private Topic topic;

    @Column(name = "status", length = 20)
    private String status;
}
