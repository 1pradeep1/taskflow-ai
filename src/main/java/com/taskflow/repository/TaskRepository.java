package com.taskflow.repository;

import com.taskflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByUserId(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
    List<Task> findByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
}