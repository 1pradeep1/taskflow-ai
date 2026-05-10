package com.taskflow.controller;

import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:5173", "https://1pradeep1.github.io"})
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAll() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(taskService.create(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id,
                                        @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(taskService.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}