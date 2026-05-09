package com.taskflow.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private String status; // TODO, IN_PROGRESS, COMPLETED

    private String priority; // LOW, MEDIUM, HIGH

    private String tags;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
