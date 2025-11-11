"use client";

import { useState, useEffect } from "react";
import { Note, NoteFormData } from "@/types/note";
import { useRouter } from "next/navigation";

interface NoteFormProps {
  note?: Note;
  onSubmit: (data: NoteFormData) => void;
}

export default function NoteForm({ note, onSubmit }: NoteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content || "",
      });
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    onSubmit(formData);
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            errors.title ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="Enter note title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          placeholder="Write your note here..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {note ? "Update Note" : "Create Note"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}