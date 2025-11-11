import { supabase } from "@/lib/supabase";
import { Task, TaskFormData } from "@/types/task";

export const database = {
  // Get all tasks for current user
  getTasks: async (): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add new task
  addTask: async (taskData: TaskFormData): Promise<Task> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,
          ...taskData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update existing task
  updateTask: async (id: string, updates: Partial<TaskFormData>): Promise<Task> => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get single task by ID
  getTask: async (id: string): Promise<Task | null> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  },
};