package teamflow.app;

import org.springframework.stereotype.Service;

import java.util.List;

@Service // 具体的な処理、ロジックを記述するところ
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> findByTeamName(String teamName) {
        return repository.findByTeamName(teamName);
    }


    public List<Task> findAll() {
        return repository.findAll();
    }

    public Task findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public Task update(Long id, Task updatedTask) {
        Task existing = repository.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setAssignee(updatedTask.getAssignee());
        existing.setStatus(updatedTask.getStatus());
        existing.setDueDate(updatedTask.getDueDate());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
