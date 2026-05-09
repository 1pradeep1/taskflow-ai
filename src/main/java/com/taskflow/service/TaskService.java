package com.taskflow.service;

import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Task> getAll() {
        return taskRepository.findByUserId(getCurrentUser().getId());
    }

    public Task create(Map<String, Object> body) {
        Task task = new Task();
        task.setTitle((String) body.get("title"));
        task.setDescription((String) body.get("description"));
        task.setPriority((String) body.get("priority"));
        task.setTags((String) body.get("tags"));
        task.setIsCompleted(false);
        task.setUser(getCurrentUser());

        if (body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()) {
            task.setDueDate(java.time.LocalDate.parse(body.get("dueDate").toString()));
        }
        if (body.get("projectId") != null) {
            Long projectId = Long.valueOf(body.get("projectId").toString());
            Project project = projectRepository.findById(projectId).orElse(null);
            task.setProject(project);
        }
        return taskRepository.save(task);
    }

    public Task update(Long id, Map<String, Object> body) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle((String) body.get("title"));
        task.setDescription((String) body.get("description"));
        task.setPriority((String) body.get("priority"));
        task.setTags((String) body.get("tags"));

        if (body.get("isCompleted") != null) {
            task.setIsCompleted((Boolean) body.get("isCompleted"));
        }
        if (body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()) {
            task.setDueDate(java.time.LocalDate.parse(body.get("dueDate").toString()));
        }
        if (body.get("projectId") != null) {
            Long projectId = Long.valueOf(body.get("projectId").toString());
            Project project = projectRepository.findById(projectId).orElse(null);
            task.setProject(project);
        } else {
            task.setProject(null);
        }
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}