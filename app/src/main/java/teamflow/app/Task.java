package teamflow.app;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity // データベースのテーブルに対応するクラスであることを表す
@Table(name = "tasks") // 詳細なマッピング（データ名、カラム名など）を定義
public class Task {

    @Id // 主キーとなるフィールドを宣言するアノテーション
    @GeneratedValue(strategy = GenerationType.IDENTITY) // エンティティの主キーに自動で一意な値を付与する

    // 主キー
    private Long id;

    // キーに割り当て
    private String title;
    private String description;
    private String assignee; // 担当者
    private String status;   // 未着手, 進行中, 完了
    private LocalDate dueDate;

    // チーム名
    public String teamName;

    // コンストラクタ
    public Task() {}

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
