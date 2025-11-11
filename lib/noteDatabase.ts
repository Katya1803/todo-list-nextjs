import { supabase } from "@/lib/supabase";
import { Note, NoteFormData } from "@/types/note";

export const noteDatabase = {
  // Get all notes for current user
  getNotes: async (): Promise<Note[]> => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add new note
  addNote: async (noteData: NoteFormData): Promise<Note> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: user.id,
          ...noteData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update existing note
  updateNote: async (id: string, updates: Partial<NoteFormData>): Promise<Note> => {
    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get single note by ID
  getNote: async (id: string): Promise<Note | null> => {
    const { data, error } = await supabase
      .from("notes")
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