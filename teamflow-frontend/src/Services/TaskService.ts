import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

export interface Task {
  id?: number;
  title: string;
  description: string;
  assignee: string;
  status: string;
  dueDate: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTask = async (task: Task) => {
  const res = await axios.post(API_URL, task);
  return res.data;
};

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
