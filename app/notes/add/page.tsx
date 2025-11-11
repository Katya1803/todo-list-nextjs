"use client";

import { useRouter } from "next/navigation";
import { NoteFormData } from "@/types/note";
import { noteDatabase } from "@/lib/noteDatabase";
import NoteForm from "@/components/NoteForm";
import BackButton from "@/components/BackButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";

function AddNotePageContent() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: NoteFormData) => {
    try {
      await noteDatabase.addNote(formData);
      router.push("/notes");
    } catch (err: any) {
      setError(err.message || "Failed to create note");
      console.error("Error creating note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Note</h1>
          <p className="text-gray-600 mt-1">Write down your thoughts</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <NoteForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}

export default function AddNotePage() {
  return (
    <ProtectedRoute>
      <AddNotePageContent />
    </ProtectedRoute>
  );
}