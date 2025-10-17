import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import "./App.css";

type Task = {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: string;
  teamName: string;
};

function App() {
  const statuses = ["未着手", "進行中", "完了"];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "未着手",
    teamName: "",
  });

  // ✅ バックエンドURLをRenderのURLに固定（ここだけ変更）
  const API_BASE = "https://teamflow-5rxv.onrender.com";

  // --- タスク編集 ---
  const handleEditTask = async (taskId: number, updatedFields: Partial<Task>) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, ...updatedFields };
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error("更新に失敗しました");
      const saved = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? saved : t)));
    } catch (error) {
      console.error("編集エラー:", error);
    }
  };

  // --- タスク削除 ---
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  // --- 初回ロードで全タスク取得 ---
  useEffect(() => {
    fetch(`${API_BASE}/api/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error("API接続失敗");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error("バックエンド未接続の可能性:", err));
  }, []);

  // --- 入力ハンドラ ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // --- タスク追加 ---
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("追加に失敗しました");
      const saved = await res.json();
      setTasks((prev) => [...prev, saved]);
    } catch (err) {
      console.error("タスク追加エラー:", err);
    }

    setNewTask({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      status: "未着手",
      teamName: "",
    });
  };

  // --- ドラッグ＆ドロップ処理 ---
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const draggedTask = tasks.find((t) => String(t.id) === draggableId);
    if (!draggedTask) return;

    const newStatus = destination.droppableId;
    const updatedTask = { ...draggedTask, status: newStatus };

    setTasks((prev) => {
      const newTasks = prev.filter((t) => t.id !== draggedTask.id);
      newTasks.splice(destination.index, 0, updatedTask);
      return newTasks;
    });

    try {
      const res = await fetch(`${API_BASE}/api/tasks/${draggedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error(`サーバー更新失敗: ${res.status}`);
    } catch (err) {
      console.error("更新エラー:", err);
    }
  };

  // --- ステータス変更 ---
  const handleStatusChange = async (task: Task, newStatus: string) => {
    const updatedTask = { ...task, status: newStatus };
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updatedTask : t))
    );

    try {
      await fetch(`${API_BASE}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
    } catch (err) {
      console.error("更新エラー:", err);
    }
  };

  // --- 描画 ---
  return (
    <div className="App">
      <h1>TeamFlow</h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <input type="text" name="title" placeholder="タイトル" value={newTask.title} onChange={handleInputChange} />
        <input type="text" name="description" placeholder="説明" value={newTask.description} onChange={handleInputChange} />
        <input type="text" name="assignee" placeholder="担当者" value={newTask.assignee} onChange={handleInputChange} />
        <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} />
        <input type="text" name="teamName" placeholder="チーム名" value={newTask.teamName} onChange={handleInputChange} />
        <select name="status" value={newTask.status} onChange={handleInputChange}>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
        <button type="submit">追加</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3>{status}</h3>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, i) => (
                      <Draggable key={String(task.id)} draggableId={String(task.id)} index={i}>
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <p><strong>担当:</strong> {task.assignee}</p>
                            <p><strong>期限:</strong> {task.dueDate}</p>
                            <p className="team">{task.teamName}</p>

                            <select value={task.status} onChange={(e) => handleStatusChange(task, e.target.value)}>
                              {statuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>

                            <button
                              onClick={() =>
                                handleEditTask(task.id, {
                                  title: prompt("新しいタイトルを入力", task.title) || task.title,
                                })
                              }
                            >
                              編集
                            </button>

                            <button onClick={() => handleDeleteTask(task.id)}>削除</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
