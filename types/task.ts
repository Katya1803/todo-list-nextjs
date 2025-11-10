export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string; // YYYY-MM-DD (snake_case for DB)
  created_at: string;
  updated_at: string;
}

export type TaskFormData = Omit<Task, "id" | "user_id" | "created_at" | "updated_at">;