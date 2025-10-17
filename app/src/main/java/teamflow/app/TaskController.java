package teamflow.app;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = {
    "https://teamflow-1.onrender.com",  // Render本番用
    "http://localhost:5173"             // 開発用
})
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return service.findAll();
    }

    @GetMapping("/team/{teamName}")
    public List<Task> getTasksByTeam(@PathVariable String teamName) {
        return service.findByTeamName(teamName);
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return service.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return service.update(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.delete(id);
    }
}
