import { Task } from "@/types/task";

const STORAGE_KEY = "todo-tasks";

export const storage = {
  getTasks: (): Task[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  addTask: (task: Task): void => {
    const tasks = storage.getTasks();
    tasks.push(task);
    storage.saveTasks(tasks);
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const tasks = storage.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      storage.saveTasks(tasks);
    }
  },

  deleteTask: (id: string): void => {
    const tasks = storage.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    storage.saveTasks(filtered);
  },
};