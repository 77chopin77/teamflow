import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../../Services/TaskService";
import type { Task } from "../../Services/TaskService";


const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>タスク一覧</h2>
      {tasks.length === 0 ? (
        <p>タスクがありません</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "10px" }}>
              <strong>{task.title}</strong>（担当：{task.assignee}）<br />
              状態：{task.status} ／ 期限：{task.dueDate}
              <br />
              <button onClick={() => handleDelete(task.id!)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
