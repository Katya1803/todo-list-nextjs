"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Note, NoteFormData } from "@/types/note";
import { noteDatabase } from "@/lib/noteDatabase";
import NoteForm from "@/components/NoteForm";
import BackButton from "@/components/BackButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function NoteDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      const data = await noteDatabase.getNote(noteId);
      setNote(data);
    } catch (err) {
      console.error("Error loading note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await noteDatabase.deleteNote(noteId);
      router.push("/notes");
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleUpdate = async (formData: NoteFormData) => {
    try {
      await noteDatabase.updateNote(noteId, formData);
      setIsEditing(false);
      loadNote();
    } catch (err: any) {
      setError(err.message || "Failed to update note");
      console.error("Error updating note:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BackButton />
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Note Not Found</h2>
            <p className="text-gray-600">The note you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
          {!isEditing && (
            <div className="flex items-center justify-between mt-4">
              <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit Note</h2>
            </div>
            <NoteForm note={note} onSubmit={handleUpdate} />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-wrap">
                {note.content || "No content"}
              </p>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-100 pt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Created: {formatDate(note.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Updated: {formatDate(note.updated_at)}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default function NoteDetailPage() {
  return (
    <ProtectedRoute>
      <NoteDetailPageContent />
    </ProtectedRoute>
  );
}