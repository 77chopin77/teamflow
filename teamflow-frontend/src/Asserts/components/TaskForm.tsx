import { useState } from "react";
import { createTask } from "../../Services/TaskService";

interface Props {
  onTaskAdded: () => void;
}

const TaskForm = ({ onTaskAdded }: Props) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("未着手");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("タイトルを入力してください");

    await createTask({
      title,
      description: "",
      assignee,
      status,
      dueDate,
    });

    setTitle("");
    setAssignee("");
    setStatus("未着手");
    setDueDate("");
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>新しいタスクを追加</h2>
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="担当者"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="未着手">未着手</option>
        <option value="進行中">進行中</option>
        <option value="完了">完了</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default TaskForm;
