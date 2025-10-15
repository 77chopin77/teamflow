package teamflow.app;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // データベースへのアクセスをするところ
public interface TaskRepository extends JpaRepository<Task, Long> {
    // チーム名で検索できるようにする
    List<Task> findByTeamName(String teamName);
}
