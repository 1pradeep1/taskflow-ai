package com.taskflow.service;

import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Project> getAll() {
        return projectRepository.findByUserId(getCurrentUser().getId());
    }

    public Project create(Project project) {
        project.setUser(getCurrentUser());
        return projectRepository.save(project);
    }

    public Project update(Long id, Project updated) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(updated.getName());
        project.setDescription(updated.getDescription());
        project.setStatus(updated.getStatus());
        project.setPriority(updated.getPriority());
        project.setDueDate(updated.getDueDate());
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}